import { afterEach, describe, expect, it, vi } from 'vitest';
import { createChatRoute } from '../app/api/chat/route';
import { lookupCoverage } from '../../src/backend/coverage-service.js';
import { resetData } from '../../src/backend/data.js';
import { computeBindingHash } from '../../src/shared/action-envelope.js';
import { assertLegalLifecycle, decodeStream } from '../../src/shared/stream-protocol.js';

describe('POST /api/chat', () => {
  afterEach(() => { vi.restoreAllMocks(); resetData(); });

  /** The implementation must drive this injected model and expose only the proposal tool. */
  function proposalModel() {
    return { doGenerate: vi.fn() } as any;
  }
  function postFor(model = proposalModel()) {
    const getSession = vi.fn(async () => ({ tenantId: 'tenant-northstar', actorId: 'csr-7' }));
    return { model, getSession, post: createChatRoute({ model, getSession }) };
  }

  it('rejects a browser request that attempts to supply tenant or actor identity', async () => {
    const { post, getSession } = postFor();
    const response = await post(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ prompt: 'change coverage', tenantId: 'other', actorId: 'other' }) }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/tenant|actor/i) });
    expect(getSession).not.toHaveBeenCalled();
  });

  it('uses the injected model and Stage 03 proposal tool to emit a live, server-bound scrubbed NDJSON lifecycle', async () => {
    const currentMember = await lookupCoverage('member-ada');
    const { model, getSession, post } = postFor();
    const response = await post(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ prompt: 'Change coverage to inactive' }) }));
    expect(response.headers.get('content-type')).toMatch(/application\/x-ndjson/i);
    expect(response.body).toBeInstanceOf(ReadableStream);
    const wire = await response.text();
    const parts = decodeStream(wire);
    assertLegalLifecycle(parts);

    // A canned stream that never touches the injected model cannot satisfy these.
    expect(model.doGenerate).toHaveBeenCalled();
    expect(getSession).toHaveBeenCalledTimes(1);
    const request = model.doGenerate.mock.calls[0]?.[0];
    expect(request.tools).toHaveProperty('proposeCoverageChange');
    expect(parts.some(part => part.type === 'tool-call' && part.toolName === 'proposeCoverageChange')).toBe(true);

    const proposal = parts.find(part => part.type === 'action-proposed');
    expect(proposal?.type).toBe('action-proposed');
    if (proposal?.type !== 'action-proposed') throw new Error('route did not emit a proposal');
    const coverageChange = proposal.action.preview.changes.find(change => change.field === 'coverageStatus');
    expect(proposal.action).toMatchObject({ tenantId: 'tenant-northstar', actorId: 'csr-7', recordRevision: currentMember.revision });
    expect(coverageChange).toEqual({ field: 'coverageStatus', before: currentMember.coverageStatus, after: 'inactive' });
    expect(proposal.action.bindingHash).toBe(computeBindingHash(proposal.action));

    // The emitted browser protocol contains scrubbed data, never Stage 03/backend identity.
    expect(wire).not.toContain(currentMember.id);
    expect(wire).not.toContain(currentMember.name);
    expect(wire).not.toContain('tenant-northstar');
    expect(wire).not.toContain('csr-7');
  });
});
