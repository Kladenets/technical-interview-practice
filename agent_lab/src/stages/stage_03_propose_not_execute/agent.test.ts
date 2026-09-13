import { afterEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../backend/coverage-service.js';
import { resetData } from '../../backend/data.js';
import { ActionEnvelopeSchema } from '../../shared/action-envelope.js';
import { createProposeCoverageChange } from './agent.js';
import { defaultMemberRefResolver } from '../../shared/member-ref.js';

const context = { toolCallId: 'proposal-1', messages: [], abortSignal: undefined };
const northstar = createProposeCoverageChange({ tenantId: 'tenant-northstar', actorId: 'csr-7' });
const ref = (memberId: string, tenantId = 'tenant-northstar') => defaultMemberRefResolver.toRef(memberId, tenantId);
const input = { memberRef: ref('member-ada'), targetStatus: 'inactive' as const };

afterEach(() => { vi.restoreAllMocks(); resetData(); });

describe('Stage 03 exercise', () => {
  it('proposes without calling the write path or mutating the live member record', async () => {
    const writeSpy = vi.spyOn(core, 'updateCoverage');
    const before = await core.lookupCoverage('member-ada');
    await expect(northstar.execute!(input, context)).resolves.toBeDefined();
    expect(writeSpy).not.toHaveBeenCalled();
    expect(await core.lookupCoverage('member-ada')).toEqual(before);
  });

  it('resolves the model-supplied ref and stores only the real server-side ID in a strict envelope', async () => {
    const envelope = await northstar.execute!(input, context);
    const parsed = ActionEnvelopeSchema.safeParse(envelope);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.action).toEqual({ type: 'coverage.change', input: { memberId: 'member-ada', targetStatus: input.targetStatus } });
    expect(JSON.stringify(parsed.data.action)).not.toContain(input.memberRef);
    expect(() => ActionEnvelopeSchema.parse({ ...parsed.data, createdAt: 'not-a-date' })).toThrow();
    expect(() => ActionEnvelopeSchema.parse({ ...parsed.data, unapproved: true })).toThrow();
  });

  it('binds a structured before/after preview and revision to current backend data', async () => {
    const member = await core.lookupCoverage('member-ada');
    const envelope: any = await northstar.execute!(input, context);
    expect(envelope.recordRevision).toBe(member.revision);
    expect(envelope.preview.changes).toContainEqual({ field: 'coverageStatus', before: member.coverageStatus, after: input.targetStatus });
  });

  it('uses server context identity and excludes model-supplied tenant and actor fields', async () => {
    const envelope: any = await northstar.execute!({ ...input, tenantId: 'tenant-lakeside', actorId: 'lakeside-csr-1' } as any, context);
    expect(envelope).toMatchObject({ tenantId: 'tenant-northstar', actorId: 'csr-7' });
    expect(envelope).not.toHaveProperty('modelTenantId');
    expect(envelope).not.toHaveProperty('tenantId', 'tenant-lakeside');
    expect(envelope).not.toHaveProperty('actorId', 'lakeside-csr-1');
  });

  it('gives equal logical changes stable keys but changes keys for a different member or status', async () => {
    const first: any = await northstar.execute!(input, context);
    const same: any = await northstar.execute!(input, { ...context, toolCallId: 'proposal-2' });
    const differentStatus: any = await northstar.execute!({ ...input, targetStatus: 'active' }, context);
    const differentMember: any = await northstar.execute!({ ...input, memberRef: ref('member-ben') }, context);
    expect(first.idempotencyKey).toBe(same.idempotencyKey);
    expect(first.idempotencyKey).not.toBe(differentStatus.idempotencyKey);
    expect(first.idempotencyKey).not.toBe(differentMember.idempotencyKey);
  });

  it('creates unique action IDs for repeated proposals of the same logical change', async () => {
    const first: any = await northstar.execute!(input, context);
    const second: any = await northstar.execute!(input, { ...context, toolCallId: 'proposal-2' });
    expect(first.actionId).not.toBe(second.actionId);
  });

  it.each([
    ['missing-actor', 'tenant-northstar', ref('member-ada'), 'actor-not-found'],
    ['reviewer-1', 'tenant-northstar', ref('member-ada'), 'missing-permission'],
    ['lakeside-csr-1', 'tenant-northstar', ref('member-ada'), 'actor-tenant-mismatch'],
    ['csr-7', 'tenant-northstar', ref('member-cora'), 'target-tenant-mismatch'],
  ] as const)('authorizes inside the proposal tool and rejects %s with %s before a backend path runs', async (actorId, tenantId, memberRef, reason) => {
    const lookupSpy = vi.spyOn(core, 'lookupCoverage');
    const writeSpy = vi.spyOn(core, 'updateCoverage');
    const tool = createProposeCoverageChange({ tenantId, actorId });
    await expect(tool.execute!({ memberRef, targetStatus: 'inactive' }, context)).rejects.toThrow(reason);
    expect(lookupSpy).not.toHaveBeenCalled();
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('rejects a cross-tenant proposal because the looked-up target belongs to another tenant', async () => {
    const lookupSpy = vi.spyOn(core, 'lookupCoverage');
    await expect(northstar.execute!({ memberRef: ref('member-cora', 'tenant-lakeside'), targetStatus: 'inactive' }, context)).rejects.toThrow();
    expect(lookupSpy).not.toHaveBeenCalled();
  });
});
