import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MessageParts } from '../components/MessageParts';
import { backendFailureStream, expiryStream, happyPathStream, rejectionStream, revisionConflictStream, type GovernedMessagePart } from '../lib/fixtures';

describe('MessageParts', () => {
  it.each([
    ['streaming text', [happyPathStream[0]], /found the member/i, /propose a change|executing|expired/i], ['complete text', [happyPathStream[1]], /propose a change/i, /found the member|executing|expired/i],
    ['tool call', [happyPathStream[2]], /proposeCoverageChange/i, /member-ada|executing|expired/i], ['tool result', [happyPathStream[3]], /member-ada/i, /proposeCoverageChange|executing|expired/i],
    ['proposed action', [happyPathStream[4]], /deactivate ada/i, /executing|expired|could not be completed/i], ['decision in flight', [happyPathStream[5]], /approv/i, /executing|expired|could not be completed/i],
    ['executing action', [happyPathStream[6]], /executing/i, /expired|could not be completed/i], ['executed receipt', [happyPathStream[7]], /coverage-33/i, /could not be completed|expired/i],
    ['rejected action', rejectionStream.slice(-1), /member requested/i, /executing|expired/i], ['expired action', expiryStream.slice(-1), /expired/i, /executing|could not be completed/i],
    ['failed action', backendFailureStream.slice(-1), /could not be completed/i, /expired/i], ['revision conflict', revisionConflictStream, /revision 41/i, /executing|expired/i],
  ] as Array<[string, GovernedMessagePart[], RegExp, RegExp]>)('renders data-driven UI for %s', (_name, parts, expected, absent) => {
    render(<MessageParts parts={parts} />); expect(screen.getByText(expected)).toBeInTheDocument(); expect(screen.queryByText(absent)).not.toBeInTheDocument();
  });

  it('renders tool results and the bound approval preview, while never exposing backend detail', () => {
    render(<MessageParts parts={[happyPathStream[3], happyPathStream[4], { type: 'error', message: 'Unable to complete request', backendDetail: 'database password=secret' }]} />);
    expect(screen.getByText(/member-ada/i)).toBeInTheDocument();
    expect(screen.getByText('coverageStatus')).toBeInTheDocument();
    expect(screen.getByText('Unable to complete request')).toBeInTheDocument();
    expect(screen.queryByText(/database password/i)).not.toBeInTheDocument();
  });

  it('does not render action-executed as success when its receipt is not bound to that action', () => {
    const executed = happyPathStream[7];
    if (executed.type !== 'action-executed') throw new Error('fixture must be executed');
    render(<MessageParts parts={[{ ...executed, receipt: { ...executed.receipt, actionId: 'wrong-action' } }]} />);
    expect(screen.queryByText(/^success$/i)).not.toBeInTheDocument();
  });

  it('renders action-executed as success when its receipt is bound to that action', () => {
    const executed = happyPathStream[7];
    if (executed.type !== 'action-executed') throw new Error('fixture must be executed');
    render(<MessageParts parts={[executed]} />);
    expect(screen.getByText(/^success$/i)).toBeInTheDocument();
  });
});
