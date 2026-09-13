import { MockLanguageModelV2 } from 'ai/test';
import type { MemberRef } from '../../shared/member-ref.js';

const usage = { inputTokens: 1, outputTokens: 1, totalTokens: 2 };
export function coverageProposalModel(memberRef: MemberRef, targetStatus: 'active' | 'inactive' = 'inactive') {
  return new MockLanguageModelV2({
    doGenerate: [
      { content: [{ type: 'tool-call', toolCallId: 'coverage-proposal', toolName: 'proposeCoverageChange', input: JSON.stringify({ memberRef, targetStatus }) }], finishReason: 'tool-calls', usage, warnings: [] },
      { content: [{ type: 'text', text: 'The change is awaiting independent review.' }], finishReason: 'stop', usage, warnings: [] },
    ],
  });
}
