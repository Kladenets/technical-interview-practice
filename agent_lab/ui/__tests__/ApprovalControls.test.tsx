import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalControls } from '../components/ApprovalControls';
import { executedAction, expiredAction, failedAction, proposedAction, rejectedAction } from '../lib/fixtures';

describe('ApprovalControls', () => {
  it('sends the action identity and binding hash when approving', () => {
    const approve = vi.fn();
    render(<ApprovalControls action={proposedAction} onApprove={approve} onReject={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));
    expect(approve).toHaveBeenCalledWith(proposedAction.actionId, proposedAction.bindingHash);
  });

  it('sends identity, binding hash, and required reason when rejecting', () => {
    const reject = vi.fn();
    render(<ApprovalControls action={proposedAction} onApprove={vi.fn()} onReject={reject} />);
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: 'Incorrect request' } });
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    expect(reject).toHaveBeenCalledWith(proposedAction.actionId, proposedAction.bindingHash, 'Incorrect request');
  });

  it('disables both controls and prevents a second decision while one is in flight', () => {
    const approve = vi.fn();
    render(<ApprovalControls action={proposedAction} deciding onApprove={approve} onReject={vi.fn()} />);
    const button = screen.getByRole('button', { name: /approve/i });
    expect(button).toBeDisabled();
    fireEvent.click(button); fireEvent.click(button);
    expect(approve).not.toHaveBeenCalled();
  });

  it.each([rejectedAction, executedAction, failedAction, expiredAction])('offers no enabled approval control for $state actions', action => {
    render(<ApprovalControls action={action} onApprove={vi.fn()} onReject={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /approve/i })).not.toBeEnabled();
    expect(screen.queryByRole('button', { name: /reject/i })).not.toBeEnabled();
  });

  it('explains expiry while the reviewer has the action open', () => {
    render(<ApprovalControls action={expiredAction} onApprove={vi.fn()} onReject={vi.fn()} />);
    expect(screen.getByText(/expired.*fresh proposal/i)).toBeInTheDocument();
  });
});
