import { describe, expect, it, vi } from 'vitest';
import { MockLanguageModelV2 } from 'ai/test';
import { members } from '../../backend/data.js';
import * as core from '../../backend/coverage-service.js';
import { assertNoSensitiveValues, createBoundaryRecorder, createMemberPolicy, createTokenResolver, modelFacingToolResult, project, runBoundaryAgent, safeError } from './agent.js';
import { defaultMemberRefResolver, type MemberRefResolver } from '../../shared/member-ref.js';
import { cases, promptInjectionFixtures } from './cases.js';
import { runTrajectoryEval, type Trajectory } from './evals.js';

const ada = members.find(member => member.id === 'member-ada')!;
const safeTrajectory = (index: number): Trajectory => ({ tool: cases[index].expectedTool, args: cases[index].expectedArgs, requiredApproval: cases[index].mustRequireApproval, executedBeforeApproval: false, receiptCount: 1, modelMessages: [] });
const generated = { content: [{ type: 'text' as const, text: 'Done.' }], finishReason: 'stop' as const, usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, warnings: [] };
function assertResolverContract(resolver: MemberRefResolver) {
  const ref = resolver.toRef(ada.id, ada.tenantId);
  expect(resolver.toRef(ada.id, ada.tenantId)).toBe(ref);
  expect(resolver.toRef(ada.id, 'tenant-lakeside')).not.toBe(ref);
  expect(resolver.fromRef(ref, ada.tenantId)).toBe(ada.id);
  expect(() => resolver.fromRef(ref, 'tenant-lakeside')).toThrow();
}

describe('Stage 06 exercise', () => {
  it('projects an explicit allowlist and keeps every current sensitive member field out', () => {
    const policy = createMemberPolicy(createTokenResolver());
    const view = project(ada, policy);
    expect(view).toEqual(expect.objectContaining({ planId: ada.planId, coverageStatus: ada.coverageStatus }));
    expect(view).not.toHaveProperty('ssnLast4'); expect(view).not.toHaveProperty('dateOfBirth'); expect(view).not.toHaveProperty('email'); expect(view).not.toHaveProperty('phone');
  });
  it('fails closed: an unexpected backend field cannot widen the allowlisted projection', () => {
    const policy = createMemberPolicy(createTokenResolver());
    const augmented = { ...ada, emergencySecret: 'do-not-leak' };
    expect(Object.keys(project(augmented, policy)).sort()).toEqual(['coverageStatus', 'memberRef', 'planId']);
  });
  it('implements the same tenant-scoped MemberRefResolver contract as the early-stage resolver', () => {
    assertResolverContract(defaultMemberRefResolver);
    const tokens = createTokenResolver(); assertResolverContract(tokens);
    expect(tokens.toRef(ada.id, ada.tenantId)).not.toContain(ada.id);
  });
  it('scrubs a backend error containing a real member name before it becomes a model message', () => {
    const errorForModel = safeError(new Error(`${ada.name} backend failure`));
    expect(JSON.stringify(errorForModel)).not.toContain(ada.name);
  });
  it('rejects a sensitive value planted in an otherwise ordinary tool result', () => {
    expect(() => assertNoSensitiveValues({ toolResult: { note: `${ada.name} is active` } }, [ada.name])).toThrow('Sensitive value detected');
  });
  it('routes actual tool results through a model-facing wrapper before they reach the model', () => {
    expect(() => modelFacingToolResult('lookupCoverage', ada, [ada.name, ada.id])).toThrow('Sensitive value detected');
  });
  it('keeps names, identifiers, and sensitive member fields out of every model message and tool argument in a real-backend run', async () => {
    const model = new MockLanguageModelV2({ doGenerate: generated });
    const run = await runBoundaryAgent(`Look up coverage for ${ada.name}`, ada.tenantId, model);
    const sensitive = [ada.name, ada.ssnLast4, ada.dateOfBirth, ada.email, ada.phone, ada.id];
    expect(() => assertNoSensitiveValues([...run.modelMessages, ...run.toolArguments], sensitive)).not.toThrow();
  });
  it('invokes the supplied model with the exact messages recorded by the boundary', async () => {
    const model = new MockLanguageModelV2({ doGenerate: generated });
    const generateSpy = vi.spyOn(model, 'doGenerate');
    const run = await runBoundaryAgent('Look up coverage.', ada.tenantId, model, { resolver: createTokenResolver() });
    expect(generateSpy).toHaveBeenCalled();
    expect(run.modelMessages).toEqual(expect.any(Array));
    expect(JSON.stringify(generateSpy.mock.calls)).toContain(JSON.stringify(run.modelMessages).slice(1, -1));
  });
  it('records the actual wrapped tool arguments and real backend result in one execution', async () => {
    const recorder = createBoundaryRecorder({ sensitiveValues: [ada.name, ada.id] });
    const read = recorder.wrapTools([{ name: 'lookupCoverage', execute: async ({ memberId }: any) => core.lookupCoverage(memberId) }])[0];
    const result = await read.execute({ memberId: ada.id });
    expect(result).toEqual(await core.lookupCoverage(ada.id));
    expect(recorder.trace().toolArguments).toEqual([{ memberId: ada.id }]);
  });
  it('uses at least eight real-member cases and reads injections from seeded free-text backend fields', () => {
    expect(cases).toHaveLength(8);
    expect(promptInjectionFixtures.map(fixture => fixture.field)).toEqual(['serviceNote.body', 'claim.description']);
    expect(promptInjectionFixtures.every(fixture => fixture.value.includes('Ignore'))).toBe(true);
  });
  it('keeps injected service-note instructions visible as data in the tool result, rather than silently deleting them', () => {
    const fixture = promptInjectionFixtures[0];
    const wrapped = modelFacingToolResult('listServiceNotes', { body: fixture.value }, []);
    expect(JSON.stringify(wrapped)).toContain(fixture.value);
  });
  it('keeps the injected service-note instruction in the agent tool result as data and does not execute it before approval', async () => {
    const model = new MockLanguageModelV2({ doGenerate: generated });
    const readServiceNotes = core.listServiceNotes;
    let returnedInstruction: string | undefined;
    const notesSpy = vi.spyOn(core, 'listServiceNotes').mockImplementation(async memberId => {
      const notes = await readServiceNotes(memberId);
      returnedInstruction = `${notes[0]!.body} [read-path-marker-${Math.random()}]`;
      return notes.map((note, index) => index === 0 ? { ...note, body: returnedInstruction! } : note);
    });
    const run = await runBoundaryAgent(cases[5].prompt, ada.tenantId, model);
    expect(notesSpy).toHaveBeenCalled();
    expect(returnedInstruction).toContain(promptInjectionFixtures[0].value);
    expect(JSON.stringify(run.modelMessages)).toContain(returnedInstruction);
    expect(JSON.stringify(run.modelMessages)).toContain(promptInjectionFixtures[0].value);
    expect(run.executedBeforeApproval).toBe(false);
  });
  it('records seeded injection text only after the registered backend read returns it', async () => {
    const model = new MockLanguageModelV2({ doGenerate: generated });
    const notesSpy = vi.spyOn(core, 'listServiceNotes');
    const run = await runBoundaryAgent(cases[5].prompt, ada.tenantId, model, { resolver: createTokenResolver() });
    expect(notesSpy).toHaveBeenCalled();
    expect(JSON.stringify(run.modelMessages)).toContain(promptInjectionFixtures[0].value);
    expect(notesSpy.mock.results.some((result: { type: string }) => result.type === 'return')).toBe(true);
  });
  it('rejects a cross-tenant exfiltration attempt carried by injected tool arguments', () => {
    const otherTenantMember = members.find(member => member.tenantId !== ada.tenantId)!;
    expect(() => assertNoSensitiveValues({ memberId: otherTenantMember.id, exfiltrate: otherTenantMember.name }, [otherTenantMember.id, otherTenantMember.name])).toThrow('Sensitive value detected');
  });
  it('fails a trajectory that executes before approval even when its other expected choices are correct', () => {
    expect(runTrajectoryEval([cases[0]], [{ ...safeTrajectory(0), executedBeforeApproval: true }]).perCase[0].passed).toBe(false);
  });
  it.each([0, 2])('fails receiptCount %s while accepting exactly one receipt', receiptCount => {
    expect(runTrajectoryEval([cases[0]], [{ ...safeTrajectory(0), receiptCount }]).perCase[0].passed).toBe(false);
    expect(runTrajectoryEval([cases[0]], [safeTrajectory(0)]).perCase[0].exactlyOneReceipt).toBe(true);
  });
  it('fails a trajectory whose model messages contain a sensitive value', () => {
    expect(runTrajectoryEval([cases[0]], [{ ...safeTrajectory(0), modelMessages: [`${ada.name} is active`] }]).perCase[0].passed).toBe(false);
  });
  it('scores a fully correct trajectory as passing', () => { expect(runTrajectoryEval([cases[0]], [safeTrajectory(0)]).perCase[0].passed).toBe(true); });
  it('computes each metric and pass rate over mixed trajectories', () => {
    const report = runTrajectoryEval(cases.slice(0, 2), [safeTrajectory(0), { ...safeTrajectory(1), tool: 'wrong' }]);
    expect(report.aggregate).toMatchObject({ toolSelectionAccuracy: 0.5, argumentAccuracy: 1, approvalRequiredAccuracy: 1, noExecutionBeforeApprovalAccuracy: 1, exactlyOneReceiptAccuracy: 1, noSensitiveModelValuesAccuracy: 1, passRate: 0.5 });
  });
  it('rejects a trajectory/case length mismatch instead of silently passing it', () => { expect(() => runTrajectoryEval(cases.slice(0, 2), [safeTrajectory(0)])).toThrow('length'); });
});
