import { computeBindingHash, type ActionEnvelope } from '../../src/shared/action-envelope.js';
import type { AuditEvent, PendingAction, Receipt } from '../../src/shared/approval-store.js';
import type { GovernedMessagePart } from '../../src/shared/stream-protocol.js';
import { defaultMemberRefResolver } from '../../src/shared/member-ref.js';

export type { GovernedMessagePart } from '../../src/shared/stream-protocol.js';

export const envelope: ActionEnvelope = {
  schemaVersion: '1', actionId: 'act-1', tenantId: 'tenant-northstar', actorId: 'csr-7', toolName: 'proposeCoverageChange',
  action: { type: 'coverage.change', input: { memberId: 'member-ada', targetStatus: 'inactive' } },
  preview: { summary: 'Deactivate Ada Lovelace coverage', changes: [{ field: 'coverageStatus', before: 'active', after: 'inactive' }, { field: 'reviewerNote', before: null, after: 'Requested by case CS-44' }] },
  recordRevision: 41, risk: 'high', createdAt: '2026-09-12T10:00:00.000Z', expiresAt: '2026-09-12T10:15:00.000Z', idempotencyKey: 'idem-1',
};
export const proposedAction: PendingAction = { ...envelope, state: 'proposed', bindingHash: computeBindingHash(envelope) };
export const approvedAction: PendingAction = { ...proposedAction, state: 'approved', approvedBy: 'reviewer-1', approvedAt: '2026-09-12T10:01:00.000Z' };
export const rejectedAction: PendingAction = { ...proposedAction, state: 'rejected', rejectedBy: 'reviewer-2', rejectedAt: '2026-09-12T10:01:00.000Z', reason: 'Member requested no change' };
export const expiredAction: PendingAction = { ...proposedAction, state: 'expired', expiresAt: '2020-01-01T00:00:00.000Z' };
export const executedAction: PendingAction = { ...approvedAction, state: 'executed' };
export const failedAction: PendingAction = { ...approvedAction, state: 'failed' };
export const receipt: Receipt = { actionId: 'act-1', tenantId: 'tenant-northstar', approvedBy: 'reviewer-1', approvedAt: '2026-09-12T10:01:00.000Z', executedAt: '2026-09-12T10:02:00.000Z', toolName: 'proposeCoverageChange', bindingHash: proposedAction.bindingHash, backendReference: 'coverage-33', outcome: 'success' };
export const failureReceipt: Receipt = { ...receipt, executedAt: '2026-09-12T10:03:00.000Z', outcome: 'failure', error: 'Concurrency conflict' };
export const auditEvents: AuditEvent[] = [
  { actionId: 'act-1', event: 'proposed', at: '2026-09-12T10:00:00.000Z' },
  { actionId: 'act-1', event: 'approved', at: '2026-09-12T10:01:00.000Z', actorId: 'reviewer-1' },
  { actionId: 'act-1', event: 'executed', at: '2026-09-12T10:02:00.000Z' },
];

export const happyPathStream: GovernedMessagePart[] = [
  { type: 'text', text: 'I found the member record…', state: 'streaming' }, { type: 'text', text: 'I can propose a change.', state: 'complete' },
  { type: 'tool-call', toolName: 'proposeCoverageChange' }, { type: 'tool-result', result: { memberRef: defaultMemberRefResolver.toRef('member-ada', 'tenant-northstar') } },
  { type: 'action-proposed', action: proposedAction }, { type: 'approval-decision', action: approvedAction }, { type: 'action-executing', action: approvedAction },
  { type: 'action-executed', action: executedAction, receipt, auditEvents },
];
export const rejectionStream: GovernedMessagePart[] = [{ type: 'action-proposed', action: proposedAction }, { type: 'action-rejected', action: rejectedAction, reason: 'Member requested no change' }];
export const expiryStream: GovernedMessagePart[] = [{ type: 'action-proposed', action: proposedAction }, { type: 'action-expired', action: expiredAction, message: 'Approval expired while this tab was open. Request a fresh proposal.' }];
export const backendFailureStream: GovernedMessagePart[] = [{ type: 'action-executing', action: approvedAction }, { type: 'action-failed', action: failedAction, receipt: failureReceipt, auditEvents: [...auditEvents, { actionId: 'act-1', event: 'failed', at: '2026-09-12T10:03:00.000Z' }], message: 'The change could not be completed.' }];
export const revisionConflictStream: GovernedMessagePart[] = [{ type: 'action-failed', action: failedAction, receipt: failureReceipt, auditEvents, message: 'The record changed from revision 41; the approved preview is no longer valid.' }];
