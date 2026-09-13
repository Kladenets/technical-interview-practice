import type { ActionEnvelope } from '../../shared/action-envelope.js';
import type { ApprovalStore as SharedApprovalStore, PendingAction as SharedPendingAction } from '../../shared/approval-store.js';
export type { ApprovalState, PendingAction, ApprovalStore } from '../../shared/approval-store.js';
import { computeBindingHash } from '../../shared/action-envelope.js';

export class InMemoryApprovalStore implements SharedApprovalStore {
  async create(_envelope: ActionEnvelope): Promise<SharedPendingAction> { throw new Error('TODO Stage 04: persist a proposed action and its binding hash'); }
  async get(_actionId: string): Promise<SharedPendingAction | undefined> { throw new Error('TODO Stage 04: retrieve a persisted action'); }
  async save(_action: SharedPendingAction): Promise<void> { throw new Error('TODO Stage 04: save a persisted action'); }
  async approve(_actionId: string, _approverId: string): Promise<SharedPendingAction> { throw new Error('TODO Stage 04: approve a pending action'); }
  async reject(_actionId: string, _approverId: string, _reason: string): Promise<SharedPendingAction> { throw new Error('TODO Stage 04: reject a pending action'); }
  async listPending(_tenantId: string): Promise<SharedPendingAction[]> { throw new Error('TODO Stage 04: list pending tenant actions'); }
  async getReceipt(_key: string): Promise<import('../../shared/approval-store.js').Receipt | undefined> { throw new Error('TODO Stage 04: retrieve an idempotent receipt'); }
  async saveReceipt(_key: string, _receipt: import('../../shared/approval-store.js').Receipt): Promise<void> { throw new Error('TODO Stage 04: persist a receipt'); }
  async claimExecution(_key: string): Promise<import('../../shared/approval-store.js').ExecutionClaim> { throw new Error('TODO Stage 04: atomically claim an idempotency key'); }
  async appendAudit(_event: import('../../shared/approval-store.js').AuditEvent): Promise<void> { throw new Error('TODO Stage 04: append audit event'); }
  async listAudit(_actionId: string): Promise<import('../../shared/approval-store.js').AuditEvent[]> { throw new Error('TODO Stage 04: list audit events'); }
  async exportState(): Promise<import('../../shared/approval-store.js').ApprovalStoreState> { throw new Error('TODO Stage 04: export persistent store state'); }
  async restoreState(_state: import('../../shared/approval-store.js').ApprovalStoreState): Promise<void> { throw new Error('TODO Stage 04: restore persistent store state'); }
}

export function requestApproval(_store: SharedApprovalStore, _envelope: ActionEnvelope) { throw new Error('TODO Stage 04: request approval without executing'); }
export function decide(_store: SharedApprovalStore, _actionId: string, _decision: 'approved' | 'rejected', _approverId: string, _reason?: string) { throw new Error('TODO Stage 04: record an out-of-band decision'); }
export function verifyBinding(_store: SharedApprovalStore, _actionId: string, _input: ActionEnvelope['action']) { void computeBindingHash; throw new Error('TODO Stage 04: verify the approval is bound to exact input'); }
