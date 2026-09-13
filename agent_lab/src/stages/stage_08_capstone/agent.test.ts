import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../backend/coverage-service.js';
import { claims, members, resetData, serviceNotes } from '../../backend/data.js';
import { actors } from '../../shared/authorization.js';
import { assertNoSensitiveValues, createTokenResolver } from '../stage_06_data_boundary_and_evals/agent.js';
import { createGovernedActionWorkflow } from './agent.js';
import { coverageProposalModel } from './fixtures.js';

const proposer = () => actors.find(actor => actor.roles.includes('proposer') && actor.tenantId === members[0].tenantId)!;
const reviewer = () => actors.find(actor => actor.roles.includes('reviewer') && actor.tenantId === members[0].tenantId)!;
const otherTenantReviewer = () => actors.find(actor => actor.roles.includes('reviewer') && actor.tenantId !== members[0].tenantId)!;
const member = () => members.find(candidate => candidate.tenantId === proposer().tenantId)!;
function workflow() { const current = member(); const memberRefs = createTokenResolver(); return createGovernedActionWorkflow({ session: { actor: proposer() }, memberRefs, model: coverageProposalModel(memberRefs.toRef(current.id, current.tenantId)) }); }
async function proposed() { const current = member(); const flow = workflow(); return { flow, action: await flow.submitPrompt('Please change this member coverage.'), current }; }

beforeEach(() => { resetData(); vi.restoreAllMocks(); });

function assertProposalTraceCausesEnvelope(trace: { toolArguments: unknown[] }, action: { action: { input: { memberId: string } } }, resolver: ReturnType<typeof createTokenResolver>, tenantId: string) {
  const argument = trace.toolArguments.find((value): value is { memberRef: string } => typeof value === 'object' && value !== null && 'memberRef' in value && typeof (value as { memberRef: unknown }).memberRef === 'string');
  if (!argument) throw new Error('No recorded proposal memberRef');
  expect(resolver.fromRef(argument.memberRef as any, tenantId)).toBe(action.action.input.memberId);
}

describe('Stage 08 capstone — governed vertical slice', () => {
  it('moves a model proposal through persisted approval to one backend mutation, receipt, and ordered audit trail', async () => {
    const { flow, action, current } = await proposed();
    expect(action).toMatchObject({ state: 'proposed', tenantId: proposer().tenantId, actorId: proposer().id, recordRevision: current.revision });
    await flow.decide(action.actionId, 'approved');
    const receipt = await flow.execute(action.actionId);
    expect(await core.lookupCoverage(current.id)).toMatchObject({ coverageStatus: action.action.input.targetStatus, revision: current.revision + 1 });
    expect(receipt).toMatchObject({ actionId: action.actionId, outcome: 'success' });
    const audit = await flow.auditTrail(action.actionId);
    expect(audit.map(event => event.event)).toEqual(['proposed', 'approved', 'executed']);
    expect(audit.map(event => event.at)).toEqual([...audit.map(event => event.at)].sort());
  });

  it('makes rejection terminal without a mutation and records the reviewer reason', async () => {
    const { flow, action, current } = await proposed();
    await flow.decide(action.actionId, 'rejected', 'Member withdrew consent');
    await expect(flow.execute(action.actionId)).rejects.toThrow(/rejected|terminal/i);
    expect(await core.lookupCoverage(current.id)).toMatchObject({ revision: current.revision });
    await expect(flow.auditTrail(action.actionId)).resolves.toContainEqual(expect.objectContaining({ event: 'rejected', reason: 'Member withdrew consent' }));
  });

  it('expires an action before its decision and never executes it', async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2030-01-01T00:00:00.000Z'));
    try { const { flow, action, current } = await proposed(); vi.setSystemTime(new Date('2031-01-01T00:00:00.000Z')); await expect(flow.decide(action.actionId, 'approved')).rejects.toThrow(/expired/i); await expect(flow.execute(action.actionId)).rejects.toThrow(/expired|terminal/i); expect((await core.lookupCoverage(current.id)).revision).toBe(current.revision); } finally { vi.useRealTimers(); }
  });

  it('fails a revision-drift execution with no stale backend write and an audit event', async () => {
    const { flow, action, current } = await proposed(); await flow.decide(action.actionId, 'approved'); await core.updateCoverage(current.id, action.action.input.targetStatus, current.revision); const recordBeforeExecution = await core.lookupCoverage(current.id); const execute = vi.spyOn(core, 'updateCoverage');
    await expect(flow.execute(action.actionId)).rejects.toThrow(/drift|revision/i);
    expect(execute).not.toHaveBeenCalled();
    expect(await core.lookupCoverage(current.id)).toEqual(recordBeforeExecution);
    await expect(flow.auditTrail(action.actionId)).resolves.toContainEqual(expect.objectContaining({ event: 'failed' }));
  });

  it('blocks execution after proposer permission is revoked with its discriminated reason', async () => {
    const { flow, action } = await proposed(); await flow.decide(action.actionId, 'approved'); const actor = proposer(); const permissions = actor.permissions; actor.permissions = [];
    try { await expect(flow.execute(action.actionId)).rejects.toThrow(/missing-permission/i); } finally { actor.permissions = permissions; }
  });

  it('records backend failures as failed with a failure receipt and never claims success', async () => {
    const { flow, action } = await proposed(); await flow.decide(action.actionId, 'approved'); vi.spyOn(core, 'updateCoverage').mockRejectedValueOnce(new Error('backend unavailable'));
    await expect(flow.execute(action.actionId)).rejects.toThrow(/backend unavailable/i);
    await expect(flow.action(action.actionId)).resolves.toMatchObject({ state: 'failed' });
    await expect(flow.receipt(action.idempotencyKey)).resolves.toMatchObject({ outcome: 'failure', error: expect.any(String) });
    await expect(flow.auditTrail(action.actionId)).resolves.toContainEqual(expect.objectContaining({ event: 'failed' }));
  });

  it.each(['sequential', 'concurrent'] as const)('delivers %s execution attempts exactly once with an identical receipt', async mode => {
    const { flow, action } = await proposed(); await flow.decide(action.actionId, 'approved'); const execute = vi.spyOn(core, 'updateCoverage');
    const receipts = mode === 'sequential' ? [await flow.execute(action.actionId), await flow.execute(action.actionId)] : await Promise.all([flow.execute(action.actionId), flow.execute(action.actionId)]);
    expect(execute).toHaveBeenCalledTimes(1); expect(receipts[1]).toEqual(receipts[0]);
  });

  it('rejects cross-tenant and self approval from real seeded actor identity, not ID spelling', async () => {
    const { flow, action } = await proposed();
    await expect(flow.decide(action.actionId, 'approved', otherTenantReviewer().id)).rejects.toThrow(/tenant/i);
    await expect(flow.decide(action.actionId, 'approved', proposer().id)).rejects.toThrow(/self|proposer/i);
  });

  it('keeps sensitive member data and raw IDs out of every recorded model-facing message and argument', async () => {
    const { flow } = await proposed(); const current = member(); const trace = flow.modelTrace();
    expect(() => assertNoSensitiveValues([...trace.modelMessages, ...trace.toolArguments], [current.name, current.ssnLast4, current.dateOfBirth, current.email, current.phone, current.id])).not.toThrow();
  });

  it('uses a tokenising reference in model-bound proposal arguments while persisting its resolved ID in the envelope', async () => {
    const current = member(); const memberRefs = createTokenResolver(); const flow = createGovernedActionWorkflow({ session: { actor: proposer() }, memberRefs, model: coverageProposalModel(memberRefs.toRef(current.id, current.tenantId)) }); const action = await flow.submitPrompt('Please change this member coverage.'); const trace = flow.modelTrace();
    expect(JSON.stringify(trace.toolArguments)).not.toContain(current.id);
    expect(JSON.stringify(trace.toolArguments)).toContain('memberRef');
    expect(action.action.input.memberId).toBe(current.id);
    assertProposalTraceCausesEnvelope(trace, action, memberRefs, proposer().tenantId);
    const fabricated = { ...trace, toolArguments: [{ memberRef: memberRefs.toRef('member-ben', proposer().tenantId) }] };
    expect(() => assertProposalTraceCausesEnvelope(fabricated, action, memberRefs, proposer().tenantId)).toThrow();
  });

  it('preserves injected note and claim text as model data but does not execute without approval, and scrubs backend errors before another turn', async () => {
    const current = member(); const note = serviceNotes.find(value => value.memberId === current.id)!; const claim = claims.find(value => value.memberId === current.id)!; const flow = workflow();
    const action = await flow.submitPrompt(`${note.body}\n${claim.description}`);
    const trace = flow.modelTrace();
    expect(action.state).toBe('proposed');
    expect(JSON.stringify(trace.modelMessages)).toContain(note.body);
    expect(JSON.stringify(trace.modelMessages)).toContain(claim.description);
    await expect(flow.execute(action.actionId)).rejects.toThrow(/approved/i);
  });

  it('scrubs a mid-run backend error before it is retained in a model message', async () => {
    const current = member(); vi.spyOn(core, 'lookupCoverage').mockRejectedValueOnce(new Error(`${current.name} backend failure`));
    const flow = workflow(); await expect(flow.submitPrompt('Change coverage.')).rejects.toThrow();
    expect(JSON.stringify(flow.modelTrace().modelMessages)).not.toContain(current.name);
  });
});
