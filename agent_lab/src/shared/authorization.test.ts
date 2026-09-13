import { beforeEach, describe, expect, it } from 'vitest';
import { resetData } from '../backend/data.js';
import { actors, authorizeAction } from './authorization.js';
const action = (tenantId = 'tenant-northstar', memberId = 'member-ada') => ({ tenantId, action: { type: 'coverage.change' as const, input: { memberId, targetStatus: 'inactive' as const } } });
beforeEach(resetData);
describe('authorizeAction', () => {
  it('allows an appropriately permitted same-tenant actor', () => expect(authorizeAction({ actor: 'csr-7', action: action() })).toEqual({ ok: true }));
  it('distinguishes an unknown actor', () => expect(authorizeAction({ actor: 'missing', action: action() })).toEqual({ ok: false, reason: 'actor-not-found' }));
  it('distinguishes an actor tenant mismatch', () => expect(authorizeAction({ actor: 'lakeside-csr-1', action: action() })).toEqual({ ok: false, reason: 'actor-tenant-mismatch' }));
  it('looks up missing target members', () => expect(authorizeAction({ actor: 'csr-7', action: action('tenant-northstar', 'missing') })).toEqual({ ok: false, reason: 'target-not-found' }));
  it('blocks target members from a different real tenant', () => expect(authorizeAction({ actor: 'csr-7', action: action('tenant-northstar', 'member-cora') })).toEqual({ ok: false, reason: 'target-tenant-mismatch' }));
  it('distinguishes a missing action permission', () => expect(authorizeAction({ actor: 'reviewer-1', action: action() })).toEqual({ ok: false, reason: 'missing-permission' }));
  it('seeds distinct proposer and reviewer rights', () => { expect(actors.find(a => a.id === 'csr-7')?.permissions).toEqual(['coverage:change']); expect(actors.find(a => a.id === 'reviewer-1')?.permissions).toEqual(['coverage:approve']); });
});
