import { describe, expect, it } from 'vitest';
import { ActionEnvelopeSchema, canonicalise, computeBindingHash, computeIdempotencyKey } from './action-envelope.js';
const envelope = { schemaVersion: '1' as const, actionId: 'a-1', tenantId: 'tenant-northstar', actorId: 'csr-7', toolName: 'proposeCoverageChange' as const, action: { type: 'coverage.change' as const, input: { memberId: 'member-ada', targetStatus: 'inactive' as const } }, preview: { summary: 'Change coverage', changes: [{ field: 'coverageStatus', before: 'active', after: 'inactive' }] }, recordRevision: 1, risk: 'high' as const, createdAt: '2026-09-12T10:00:00.000Z', expiresAt: '2026-09-12T10:15:00.000Z', idempotencyKey: 'key' };
describe('action envelope', () => {
  it('requires the structured versioned contract', () => expect(ActionEnvelopeSchema.safeParse(envelope).success).toBe(true));
  it('canonicalises object key order', () => expect(canonicalise({ b: 1, a: 2 })).toBe(canonicalise({ a: 2, b: 1 })));
  it('binds action, preview, and revision', () => { const hash = computeBindingHash(envelope); expect(computeBindingHash({ ...envelope, recordRevision: 2 })).not.toBe(hash); expect(computeBindingHash({ ...envelope, preview: { ...envelope.preview, summary: 'Different' } })).not.toBe(hash); });
  it('derives idempotency from the logical action', () => expect(computeIdempotencyKey(envelope.action)).toBe(computeIdempotencyKey(envelope.action)));
});
