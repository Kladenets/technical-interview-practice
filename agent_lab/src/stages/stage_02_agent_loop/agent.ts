import { generateText, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import * as core from '../../backend/coverage-service.js';
import { getLiveModel } from '../../shared/model.js';
import type { MemberRef } from '../../shared/member-ref.js';

/** Model-facing member tools accept `{ memberRef: MemberRef }`, then resolve it server-side. */
export type MemberToolInput = { memberRef: MemberRef };

export async function answerBenefitsQuestion(_question: string, _model: any = getLiveModel()): Promise<any> {
  // TODO: Define listDependents and getPlanBenefits tools. Catch backend errors inside execute
  // and return { error: message }; then call generateText with stepCountIs(3).
  void generateText; void stepCountIs; void tool; void z; void core;
  throw new Error('TODO Stage 02: implement answerBenefitsQuestion');
}
if (import.meta.url === `file://${process.argv[1]}`) answerBenefitsQuestion('What benefits does Ada plan include?').then(r => console.log(r.text));
