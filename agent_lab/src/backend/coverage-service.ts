import { claims, dependents, members, plans, serviceNotes } from './data.js';
import type { Claim, CoverageStatus, Member, ServiceNote } from './types.js';

export interface ServiceOptions { delay?: (operation: string) => number; shouldFail?: (operation: string) => boolean; }
let options: Required<ServiceOptions> = { delay: () => 1, shouldFail: () => false };
export function configureService(next: ServiceOptions = {}) { options = { delay: next.delay ?? (() => 1), shouldFail: next.shouldFail ?? (() => false) }; }
export function resetServiceConfiguration() { configureService(); }
async function pause(operation: string) {
  const milliseconds = options.delay(operation);
  if (!Number.isFinite(milliseconds) || milliseconds < 0) throw new Error('Service delay must be a non-negative finite number');
  await new Promise(resolve => setTimeout(resolve, milliseconds));
  if (options.shouldFail(operation)) throw new Error('Payer core system is temporarily unavailable');
}
function copy<T>(record: T): T { return structuredClone(record); }
export async function lookupCoverage(memberId: string): Promise<Member> { await pause('lookupCoverage'); const member = members.find(c => c.id === memberId); if (!member) throw new Error(`Member ${memberId} was not found`); return copy(member); }
export async function listDependents(memberId: string) { await pause('listDependents'); return dependents.filter(d => d.memberId === memberId).map(copy); }
export async function getPlanBenefits(planId: string) { await pause('getPlanBenefits'); const plan = plans.find(c => c.id === planId); if (!plan) throw new Error(`Plan ${planId} was not found`); return copy(plan); }
export async function listClaims(memberId: string): Promise<Claim[]> { await pause('listClaims'); return claims.filter(c => c.memberId === memberId).map(copy); }
export async function listServiceNotes(memberId: string): Promise<ServiceNote[]> { await pause('listServiceNotes'); return serviceNotes.filter(n => n.memberId === memberId).map(copy); }
export async function updateCoverage(memberId: string, coverageStatus: CoverageStatus, expectedRevision: number): Promise<Member> {
  await pause('updateCoverage'); const member = members.find(c => c.id === memberId); if (!member) throw new Error(`Member ${memberId} was not found`);
  if (member.revision !== expectedRevision) throw new Error(`Revision conflict for member ${memberId}: expected ${expectedRevision}, found ${member.revision}`);
  member.coverageStatus = coverageStatus; member.revision += 1; return copy(member);
}
