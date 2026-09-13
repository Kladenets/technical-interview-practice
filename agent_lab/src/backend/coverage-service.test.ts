import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { configureService, listClaims, listDependents, listServiceNotes, lookupCoverage, resetServiceConfiguration, updateCoverage } from './coverage-service.js';
import { resetData } from './data.js';
beforeEach(() => { resetData(); resetServiceConfiguration(); });
afterEach(resetServiceConfiguration);
describe('payer core system', () => {
  it('returns copied coverage records', async () => expect((await lookupCoverage('member-ada')).name).toBe('Ada Rivera'));
  it('enforces optimistic concurrency revisions', async () => { const member = await lookupCoverage('member-ada'); const updated = await updateCoverage(member.id, 'inactive', member.revision); expect(updated.revision).toBe(2); await expect(updateCoverage(member.id, 'active', member.revision)).rejects.toThrow(/revision conflict/i); });
  it('keeps records scoped to their real tenants', async () => { expect((await lookupCoverage('member-cora')).tenantId).toBe('tenant-lakeside'); expect((await lookupCoverage('member-ada')).tenantId).toBe('tenant-northstar'); });
  it('supports an injected intermittent downstream failure', async () => { configureService({ shouldFail: operation => operation === 'listDependents' }); await expect(listDependents('member-ada')).rejects.toThrow(/temporarily unavailable/i); });
  it('uses injected deterministic latency', async () => { const delay = vi.fn(() => 0); configureService({ delay }); await lookupCoverage('member-ada'); expect(delay).toHaveBeenCalledWith('lookupCoverage'); });
  it('reset restores records and revisions', async () => { await updateCoverage('member-ada', 'inactive', 1); resetData(); await expect(lookupCoverage('member-ada')).resolves.toMatchObject({ coverageStatus: 'active', revision: 1 }); });
  it('exposes free-text claims and service notes through backend reads', async () => { await expect(listClaims('member-ada')).resolves.toHaveLength(1); await expect(listServiceNotes('member-ada')).resolves.toHaveLength(1); });
});
