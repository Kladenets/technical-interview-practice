import { createProposeCoverageChange } from '../../../../src/stages/stage_03_propose_not_execute/agent.js';

export interface ChatRouteDependencies { model: unknown; getSession: () => Promise<{ tenantId: string; actorId: string }>; }

/**
 * Contract: accept only a prompt from the browser. tenantId and actorId come from the
 * server session, never the request body. Expose only createProposeCoverageChange for
 * that context; model-facing results must pass through Stage 06's data boundary before
 * being encoded as an AI SDK UI-message stream.
 */
export function createChatRoute(_deps: ChatRouteDependencies) {
  return async function POST(_request: Request): Promise<Response> {
  void createProposeCoverageChange;
  throw new Error('TODO Stage 07: stream the proposeCoverageChange tool as UI message parts');
  };
}

export const POST = createChatRoute({ model: undefined, getSession: async () => ({ tenantId: '', actorId: '' }) });
