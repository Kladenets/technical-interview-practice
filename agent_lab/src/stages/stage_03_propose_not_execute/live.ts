import { getLiveModel } from '../../shared/model.js';
import { defaultMemberRefResolver } from '../../shared/member-ref.js';
import { beginLiveStage, handleLiveError, printStructured } from '../../shared/live-runner.js';
import { createProposeCoverageChange } from './agent.js';

const prompt = 'Propose changing Ada Rivera\'s coverage to inactive; do not execute it.';
if (beginLiveStage('03', prompt)) {
  try {
    getLiveModel(); // Validate the configured provider consistently with model-driven stages.
    const input = { memberRef: defaultMemberRefResolver.toRef('member-ada', 'tenant-northstar'), targetStatus: 'inactive' as const };
    console.log(`Tool call\n  proposeCoverageChange(${JSON.stringify(input)})`);
    const proposalTool: any = createProposeCoverageChange({ tenantId: 'tenant-northstar', actorId: 'csr-7' });
    const envelope = await proposalTool.execute(input, {});
    printStructured('Tool result / envelope preview', envelope);
    console.log('\nSteps\n  1\n\nFinal text\n  Proposal returned for independent review.');
  } catch (error) { handleLiveError('03', 'src/stages/stage_03_propose_not_execute', error); }
}
