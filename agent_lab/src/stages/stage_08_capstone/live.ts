import { getLiveModel } from '../../shared/model.js';
import { actors } from '../../shared/authorization.js';
import { beginLiveStage, handleLiveError, printStructured } from '../../shared/live-runner.js';
import { createGovernedActionWorkflow } from './agent.js';

const prompt = 'Change Ada Rivera\'s coverage to inactive and submit it for review.';
if (beginLiveStage('08', prompt)) {
  try {
    const proposer = actors.find(actor => actor.id === 'csr-7')!;
    const flow = createGovernedActionWorkflow({ model: getLiveModel(), session: { actor: proposer } });
    console.log('Timeline\n  1. model receives prompt');
    const action = await flow.submitPrompt(prompt);
    console.log('  2. proposal persisted: proposed'); printStructured('Envelope preview', action);
    const approved = await flow.decide(action.actionId, 'approved', 'approved by seeded reviewer');
    console.log('  3. reviewer-1 approves: approved'); printStructured('Approved action', approved);
    const receipt = await flow.execute(action.actionId);
    console.log('  4. execution completed: executed'); printStructured('Receipt', receipt);
    printStructured('Audit trail', await flow.auditTrail(action.actionId)); printStructured('Model boundary trace', flow.modelTrace());
  } catch (error) { handleLiveError('08', 'src/stages/stage_08_capstone', error); }
}
