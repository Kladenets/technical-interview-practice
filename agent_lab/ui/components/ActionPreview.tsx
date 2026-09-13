import type { PendingAction, Receipt } from '../../src/shared/approval-store.js';
import type { ReactNode } from 'react';

export function ActionPreview(_props: { action: PendingAction; receipt?: Receipt }): ReactNode {
  throw new Error('TODO Stage 07: render the bound preview, before/after values, risk, expiry, and proposed versus executed state');
}
