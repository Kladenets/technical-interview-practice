import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActionPreview } from '../components/ActionPreview';
import { approvedAction, proposedAction, receipt } from '../lib/fixtures';

describe('ActionPreview', () => {
  it('renders every exact structured preview row with revision, risk, and expiry', () => {
    render(<ActionPreview action={proposedAction} />);
    expect(screen.getByText('coverageStatus')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
    expect(screen.getByText('reviewerNote')).toBeInTheDocument();
    expect(screen.getByText('Requested by case CS-44')).toBeInTheDocument();
    expect(screen.getByText(/41/)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-09-12T10:15:00.000Z/)).toBeInTheDocument();
  });

  it('visibly distinguishes a proposed change from a receipted completed change', () => {
    const { rerender } = render(<ActionPreview action={proposedAction} />);
    expect(screen.getByText(/this will happen/i)).toBeInTheDocument();
    rerender(<ActionPreview action={{ ...approvedAction, state: 'executed' }} receipt={receipt} />);
    expect(screen.getByText(/this has happened/i)).toBeInTheDocument();
  });

  it('does not render an executed action as completed when the receipt belongs to another action, tenant, or binding', () => {
    const mismatchedReceipt = { ...receipt, actionId: 'act-other', tenantId: 'tenant-other', bindingHash: 'b'.repeat(64) };
    render(<ActionPreview action={{ ...approvedAction, state: 'executed' }} receipt={mismatchedReceipt} />);
    expect(screen.queryByText(/this has happened|executed successfully|success/i)).not.toBeInTheDocument();
  });

  it('never renders approved work as executed when its receipt is absent', () => {
    render(<ActionPreview action={approvedAction} />);
    expect(screen.queryByText(/this has happened|executed successfully|success/i)).not.toBeInTheDocument();
  });
});
