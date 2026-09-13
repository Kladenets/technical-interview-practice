import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReceiptView } from '../components/ReceiptView';
import { auditEvents, executedAction, failureReceipt, receipt } from '../lib/fixtures';

describe('ReceiptView', () => {
  it('renders receipt identity and sorts audit events chronologically', () => {
    render(<ReceiptView action={executedAction} receipt={receipt} auditEvents={[auditEvents[2], auditEvents[0], auditEvents[1]]} />);
    for (const value of ['act-1', 'reviewer-1', '2026-09-12T10:01:00.000Z', '2026-09-12T10:02:00.000Z', 'coverage-33', 'success']) expect(screen.getByText(new RegExp(value, 'i'))).toBeInTheDocument();
    expect(screen.getAllByTestId('audit-event').map(node => node.textContent)).toEqual(['proposed', 'approved', 'executed']);
  });

  it('renders a failure receipt as failure rather than success', () => {
    render(<ReceiptView action={executedAction} receipt={failureReceipt} auditEvents={auditEvents} />);
    expect(screen.getByText(/failure/i)).toBeInTheDocument();
    expect(screen.queryByText(/^success$/i)).not.toBeInTheDocument();
  });

  it.each([
    ['action', { ...receipt, actionId: 'act-other' }],
    ['tenant', { ...receipt, tenantId: 'tenant-other' }],
    ['binding', { ...receipt, bindingHash: 'b'.repeat(64) }],
  ])('does not allow a receipt with another %s to claim success', (_dimension, mismatchedReceipt) => {
    render(<ReceiptView action={executedAction} receipt={mismatchedReceipt} auditEvents={auditEvents} />);
    expect(screen.queryByText(/^success$/i)).not.toBeInTheDocument();
  });

  it('renders a receipt as success only when its action, tenant, and binding match', () => {
    render(<ReceiptView action={executedAction} receipt={receipt} auditEvents={auditEvents} />);
    expect(screen.getByText(/^success$/i)).toBeInTheDocument();
  });
});
