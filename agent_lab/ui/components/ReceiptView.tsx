import type { AuditEvent, PendingAction, Receipt } from '../../src/shared/approval-store.js';
import type { ReactNode } from 'react';

export function ReceiptView(_props: { action: PendingAction; receipt: Receipt; auditEvents: AuditEvent[] }): ReactNode {
  throw new Error('TODO Stage 07: render the receipt and chronological audit trail');
}
