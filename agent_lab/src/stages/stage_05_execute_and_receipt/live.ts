import { getLiveModel } from '../../shared/model.js';
import { beginLiveStage, handleLiveError, printStructured } from '../../shared/live-runner.js';
import { InMemoryApprovalStore, requestApproval, decide } from '../stage_04_human_approval/agent.js';
import { executeApproved } from './agent.js';
import { sampleEnvelope } from '../../shared/live-runner.js';

const prompt = 'Execute the independently approved Ada Rivera coverage proposal.';
if (beginLiveStage('05', prompt)) {
  try {
    getLiveModel(); const store = new InMemoryApprovalStore();
    const proposed: any = await (requestApproval as any)(store, sampleEnvelope);
    console.log('Action state transition\n  draft -> proposed -> approved');
    await (decide as any)(store, proposed.actionId, 'approved', 'reviewer-1');
    const receipt = await executeApproved(proposed.actionId, { store, actor: 'csr-7' });
    console.log('\nAction state transition\n  approved -> executed');
    printStructured('Receipt', receipt); printStructured('Audit trail', await store.listAudit(proposed.actionId));
  } catch (error) { handleLiveError('05', 'src/stages/stage_05_execute_and_receipt', error); }
}
