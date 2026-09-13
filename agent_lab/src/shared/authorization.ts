import { members } from '../backend/data.js';
import type { ActionEnvelope } from './action-envelope.js';

export interface Actor { id: string; tenantId: string; roles: string[]; permissions: string[]; }
export const actors: Actor[] = [
  { id: 'csr-7', tenantId: 'tenant-northstar', roles: ['proposer'], permissions: ['coverage:change'] },
  { id: 'reviewer-1', tenantId: 'tenant-northstar', roles: ['reviewer'], permissions: ['coverage:approve'] },
  { id: 'lakeside-csr-1', tenantId: 'tenant-lakeside', roles: ['proposer'], permissions: ['coverage:change'] },
  { id: 'lakeside-reviewer-1', tenantId: 'tenant-lakeside', roles: ['reviewer'], permissions: ['coverage:approve'] },
];
export type AuthorizationResult = { ok: true } | { ok: false; reason: 'actor-not-found' | 'actor-tenant-mismatch' | 'target-not-found' | 'target-tenant-mismatch' | 'missing-permission' };
export function authorizeAction({ actor, action }: { actor: Actor | string; action: Pick<ActionEnvelope, 'tenantId' | 'action'> }): AuthorizationResult {
  const registered = typeof actor === 'string' ? actors.find(candidate => candidate.id === actor) : actors.find(candidate => candidate.id === actor.id);
  if (!registered) return { ok: false, reason: 'actor-not-found' };
  if (registered.tenantId !== action.tenantId) return { ok: false, reason: 'actor-tenant-mismatch' };
  const member = members.find(candidate => candidate.id === action.action.input.memberId);
  if (!member) return { ok: false, reason: 'target-not-found' };
  if (member.tenantId !== action.tenantId) return { ok: false, reason: 'target-tenant-mismatch' };
  if (!registered.permissions.includes('coverage:change')) return { ok: false, reason: 'missing-permission' };
  return { ok: true };
}
