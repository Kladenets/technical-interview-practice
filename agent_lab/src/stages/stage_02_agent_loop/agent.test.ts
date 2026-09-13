import { afterEach, describe, expect, it, vi } from 'vitest';
import { MockLanguageModelV2 } from 'ai/test';
import * as core from '../../backend/coverage-service.js';
import { dependents as seededDependents } from '../../backend/data.js';
import { answerBenefitsQuestion } from './agent.js';
import { defaultMemberRefResolver } from '../../shared/member-ref.js';
const usage = { inputTokens: 1, outputTokens: 1, totalTokens: 2 };
const response = (content: any[], finishReason: 'tool-calls' | 'stop') => ({ content, finishReason, usage, warnings: [] });
const call = (toolName: string, input: object, id = toolName) => response([{ type: 'tool-call', toolCallId: id, toolName, input: JSON.stringify(input) }], 'tool-calls');
const adaRef = defaultMemberRefResolver.toRef('member-ada', 'tenant-northstar');

afterEach(() => { core.resetServiceConfiguration(); vi.restoreAllMocks(); });

describe('Stage 02 exercise', () => {
  it('chains dependents before benefits and uses the planId returned by the real first call', async () => {
    // Make a valid plan id appear only in this first tool's live result. A solution
    // that hard-codes the fixture's usual plan-gold value cannot satisfy this chain.
    seededDependents[0].planId = 'plan-basic';
    const dependentSpy = vi.spyOn(core, 'listDependents');
    const benefitsSpy = vi.spyOn(core, 'getPlanBenefits');
    const returnedDependents = await core.listDependents('member-ada');
    const returnedPlanId = returnedDependents[0].planId;
    dependentSpy.mockClear();
    const model = new MockLanguageModelV2({ doGenerate: [call('listDependents', { memberRef: adaRef }), call('getPlanBenefits', { planId: returnedPlanId }), response([{ type: 'text', text: 'Answered.' }], 'stop')] });
    const result = await answerBenefitsQuestion('What covers Ada’s dependent?', model);
    expect(result.steps).toHaveLength(3);
    expect(dependentSpy).toHaveBeenCalledWith('member-ada');
    expect(returnedPlanId).toBe('plan-basic');
    expect(benefitsSpy).toHaveBeenCalledWith(returnedPlanId);
    expect(dependentSpy.mock.invocationCallOrder[0]).toBeLessThan(benefitsSpy.mock.invocationCallOrder[0]);
  });

  it('returns a thrown backend failure as tool-result data for the next model turn', async () => {
    core.configureService({ shouldFail: operation => operation === 'listDependents' });
    const model = new MockLanguageModelV2({ doGenerate: [call('listDependents', { memberRef: adaRef }), response([{ type: 'text', text: 'The system is temporarily unavailable.' }], 'stop')] });
    const result = await answerBenefitsQuestion('List dependents', model);
    expect(result.text).toContain('unavailable');
    expect(result.steps).toHaveLength(2);
    expect(JSON.stringify(model.doGenerateCalls[1])).toContain('Payer core system is temporarily unavailable');
  });

  it('answers in one step when the model determines no tool is needed', async () => {
    const model = new MockLanguageModelV2({ doGenerate: response([{ type: 'text', text: 'Coverage changes require approval.' }], 'stop') });
    const result = await answerBenefitsQuestion('Do changes require approval?', model);
    expect(result.text).toContain('approval');
    expect(result.steps).toHaveLength(1);
  });

  it('records one step for every model turn', async () => {
    const model = new MockLanguageModelV2({ doGenerate: [call('listDependents', { memberRef: adaRef }), response([{ type: 'text', text: 'Finished.' }], 'stop')] });
    expect((await answerBenefitsQuestion('List Ada dependents', model)).steps).toHaveLength(2);
  });

  it('enforces the three-step cap when a model keeps proposing calls', async () => {
    const model = new MockLanguageModelV2({ doGenerate: [call('listDependents', { memberRef: adaRef }, 'one'), call('listDependents', { memberRef: adaRef }, 'two'), call('listDependents', { memberRef: adaRef }, 'three'), call('listDependents', { memberRef: adaRef }, 'four')] });
    const result = await answerBenefitsQuestion('Loop', model);
    expect(result.steps).toHaveLength(3);
    expect(model.doGenerateCalls).toHaveLength(3);
  });
});
