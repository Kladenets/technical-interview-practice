import { getLiveModel } from '../../shared/model.js';
import { beginLiveStage, handleLiveError, printStructured, sampleEnvelope } from '../../shared/live-runner.js';
import { InMemoryApprovalStore, requestApproval, decide } from './agent.js';

const prompt = 'Submit Ada Rivera\'s proposed coverage change for reviewer approval.';
if (beginLiveStage('04', prompt)) {
  try {
    getLiveModel();
    const store = new InMemoryApprovalStore();
    console.log('Action state transition\n  draft -> proposed');
    const proposed: any = await (requestApproval as any)(store, sampleEnvelope);
    printStructured('Envelope preview', proposed);
    const approved = await (decide as any)(store, proposed.actionId, 'approved', 'reviewer-1');
    console.log('\nAction state transition\n  proposed -> approved');
    printStructured('Approved action', approved);
    printStructured('Audit trail', await store.listAudit(proposed.actionId));
  } catch (error) { handleLiveError('04', 'src/stages/stage_04_human_approval', error); }
}
