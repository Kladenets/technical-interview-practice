import { tool } from 'ai';
import { z } from 'zod';
import { lookupCoverage } from '../../backend/coverage-service.js';
import { ActionEnvelopeSchema } from '../../shared/action-envelope.js';
import { defaultMemberRefResolver, type MemberRefResolver } from '../../shared/member-ref.js';

export interface ServerActionContext { tenantId: string; actorId: string; memberRefs?: MemberRefResolver; }
export function createProposeCoverageChange(_context: ServerActionContext) { return tool({
  description: 'Propose, but never execute, a member coverage-status change.',
  inputSchema: z.object({ memberRef: z.string(), targetStatus: z.enum(['active', 'inactive']) }),
  execute: async (_input): Promise<unknown> => {
    // TODO: Resolve _input.memberRef with (_context.memberRefs ?? defaultMemberRefResolver) before lookup.
    // The envelope stores the resolved input.memberId: it is server-owned evidence, not model-facing data.
    // Look up the member, validate tenant ownership, and return an ActionEnvelopeSchema
    // envelope with a before/after preview. Do not call updateCoverage.
    void lookupCoverage; void ActionEnvelopeSchema; void defaultMemberRefResolver;
    throw new Error('TODO Stage 03: implement proposeCoverageChange');
  },
}); }
export const proposeCoverageChange = createProposeCoverageChange({ tenantId: 'tenant-northstar', actorId: 'csr-7' });
