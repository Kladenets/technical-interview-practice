import { generateText, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { lookupCoverage as lookupCoverageInCore } from '../../backend/coverage-service.js';
import { getLiveModel } from '../../shared/model.js';
import { defaultMemberRefResolver, type MemberRef } from '../../shared/member-ref.js';

const tenantId = 'tenant-northstar';

export const lookupCoverage = tool({
  description: 'Look up a member coverage record by its opaque member reference.',
  inputSchema: z.object({ memberRef: z.string() }),
  execute: async ({ memberRef }) => lookupCoverageInCore(defaultMemberRefResolver.fromRef(memberRef as MemberRef, tenantId)),
});

export async function answerCoverageQuestion(_question: string, _model: any = getLiveModel()): Promise<any> {
  // TODO: Call generateText with _model, the question, { lookupCoverage }, and stepCountIs(2).
  // Return the complete result so callers can inspect text and steps.
  void generateText; void stepCountIs; void lookupCoverage;
  throw new Error('TODO Stage 01: implement answerCoverageQuestion');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  answerCoverageQuestion('What is the coverage status for member-ada?').then(result => console.log(result.text));
}
