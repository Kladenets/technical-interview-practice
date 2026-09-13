import type { PendingAction } from '../../src/shared/approval-store.js';
import type { ReactNode } from 'react';

export function ApprovalControls(_props: { action: PendingAction; deciding?: boolean; onApprove: (actionId: string, bindingHash: string) => void; onReject: (actionId: string, bindingHash: string, reason: string) => void }): ReactNode {
  throw new Error('TODO Stage 07: add bound approve/reject controls, reject reason validation, and terminal/expiry/double-submit guards');
}
