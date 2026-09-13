import { describe, expect, it } from 'vitest';
import { assertLegalLifecycle, decodeStream, encodeStreamPart, type GovernedMessagePart } from './stream-protocol.js';

const action = { schemaVersion: '1' as const, actionId: 'act-1', tenantId: 'tenant-1', actorId: 'actor-1', toolName: 'proposeCoverageChange' as const, action: { type: 'coverage.change' as const, input: { memberId: 'member-1', targetStatus: 'inactive' as const } }, preview: { summary: 'Change coverage', changes: [{ field: 'coverageStatus', before: 'active', after: 'inactive' }] }, recordRevision: 1, risk: 'high' as const, createdAt: '2026-09-12T10:00:00.000Z', expiresAt: '2026-09-12T10:15:00.000Z', idempotencyKey: 'idem-1', bindingHash: 'a'.repeat(64) };
const receipt = { actionId: 'act-1', tenantId: 'tenant-1', executedAt: '2026-09-12T10:02:00.000Z', toolName: 'proposeCoverageChange' as const, bindingHash: 'a'.repeat(64), outcome: 'success' as const };
const auditEvents = [{ actionId: 'act-1', event: 'executed' as const, at: '2026-09-12T10:02:00.000Z' }];

describe('governed NDJSON stream protocol', () => {
  const variants: GovernedMessagePart[] = [
    { type: 'text', text: 'Writing', state: 'streaming' }, { type: 'text', text: 'Written', state: 'complete' }, { type: 'tool-call', toolName: 'proposeCoverageChange' }, { type: 'tool-result', result: { reference: 'ref-1' } },
    { type: 'action-proposed', action: { ...action, state: 'proposed' } }, { type: 'approval-decision', action: { ...action, state: 'approved' } }, { type: 'action-executing', action: { ...action, state: 'approved' } },
    { type: 'action-executed', action: { ...action, state: 'executed' }, receipt, auditEvents }, { type: 'action-rejected', action: { ...action, state: 'rejected' }, reason: 'No longer needed' }, { type: 'action-failed', action: { ...action, state: 'failed' }, receipt: { ...receipt, outcome: 'failure' }, auditEvents, message: 'Could not complete' }, { type: 'action-expired', action: { ...action, state: 'expired' }, message: 'Expired' }, { type: 'error', message: 'Unavailable' },
  ];
  it('round-trips every discriminated-union variant through NDJSON', () => expect(decodeStream(variants.map(encodeStreamPart).join(''))).toEqual(variants));
  it('rejects a malformed event rather than inventing a client-local event', () => expect(() => decodeStream('{"type":"action-proposed","action":{"actionId":"missing-fields"}}\n')).toThrow());
  it('accepts a legal proposal lifecycle', () => expect(() => assertLegalLifecycle(variants.slice(4, 8))).not.toThrow());
});
