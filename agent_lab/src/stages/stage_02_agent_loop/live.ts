import { getLiveModel } from '../../shared/model.js';
import { beginLiveStage, handleLiveError, printModelTrace } from '../../shared/live-runner.js';
import { answerBenefitsQuestion } from './agent.js';

const prompt = 'For Ada Rivera, find her dependents and explain the benefits of her plan.';
if (beginLiveStage('02', prompt)) {
  try { printModelTrace(await answerBenefitsQuestion(prompt, getLiveModel())); }
  catch (error) { handleLiveError('02', 'src/stages/stage_02_agent_loop', error); }
}
