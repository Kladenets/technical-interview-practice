import { ActionPreview } from './ActionPreview';
import { ReceiptView } from './ReceiptView';
import type { GovernedMessagePart } from '../../src/shared/stream-protocol.js';
import type { ReactNode } from 'react';

export function MessageParts(_props: { parts: GovernedMessagePart[] }): ReactNode {
  void ActionPreview; void ReceiptView;
  throw new Error('TODO Stage 07: render every governed message-part lifecycle state and scrubbed error message');
}
