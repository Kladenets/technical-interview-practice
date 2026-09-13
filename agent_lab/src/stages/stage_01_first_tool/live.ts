import { getLiveModel } from '../../shared/model.js';
import { beginLiveStage, handleLiveError, printModelTrace } from '../../shared/live-runner.js';
import { answerCoverageQuestion } from './agent.js';

const prompt = 'What is the coverage status for Ada Rivera? Use the coverage lookup tool.';
if (beginLiveStage('01', prompt)) {
  try { printModelTrace(await answerCoverageQuestion(prompt, getLiveModel())); }
  catch (error) { handleLiveError('01', 'src/stages/stage_01_first_tool', error); }
}
