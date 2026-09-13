import { getLiveModel } from '../../shared/model.js';
import { beginLiveStage, handleLiveError, printStructured } from '../../shared/live-runner.js';
import { runBoundaryAgent } from './agent.js';

const prompt = 'Look up Ada Rivera coverage using only a model-safe member reference.';
if (beginLiveStage('06', prompt)) {
  try {
    const trace = await runBoundaryAgent(prompt, 'tenant-northstar', getLiveModel());
    printStructured('Structured boundary trace', trace);
    console.log(`\nSteps\n  ${trace.toolResults.length}\n\nFinal text\n  Boundary run completed.`);
  } catch (error) { handleLiveError('06', 'src/stages/stage_06_data_boundary_and_evals', error); }
}
