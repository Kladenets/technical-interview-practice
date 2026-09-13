import { authorizeAction } from '../../shared/authorization.js';
import { ActionEnvelopeSchema } from '../../shared/action-envelope.js';
import type { ApprovalStore, AuditEvent, PendingAction, Receipt } from '../../shared/approval-store.js';
import * as coverageService from '../../backend/coverage-service.js';
export type { AuditEvent, Receipt } from '../../shared/approval-store.js';

export interface ExecutionDependencies {
  store: ApprovalStore;
  actor: string;
}
export async function executeApproved(_actionId: string, _deps: ExecutionDependencies): Promise<Receipt> {
  // TODO: Load approved action; check expiry, authorization, schema, drift, and idempotency before executing.
  // On success create an auditable receipt; on failure mark the action failed and audit it.
  void authorizeAction; void ActionEnvelopeSchema; void coverageService;
  throw new Error('TODO Stage 05: execute an approved action with a receipt');
}
