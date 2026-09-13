import { afterEach, describe, expect, it, vi } from 'vitest';
import { MockLanguageModelV2 } from 'ai/test';
import * as core from '../../backend/coverage-service.js';
import { answerCoverageQuestion } from './agent.js';
import { defaultMemberRefResolver } from '../../shared/member-ref.js';

const usage = { inputTokens: 1, outputTokens: 1, totalTokens: 2 };
const response = (content: any[], finishReason: 'tool-calls' | 'stop') => ({ content, finishReason, usage, warnings: [] });
const adaRef = defaultMemberRefResolver.toRef('member-ada', 'tenant-northstar');
const lookup = (ref: string) => response([{ type: 'tool-call', toolCallId: `lookup-${ref}`, toolName: 'lookupCoverage', input: JSON.stringify({ memberRef: ref }) }], 'tool-calls');

afterEach(() => vi.restoreAllMocks());

describe('Stage 01 exercise', () => {
  it('resolves the model-supplied member ref before calling the backend with its real ID', async () => {
    const spy = vi.spyOn(core, 'lookupCoverage');
    const model = new MockLanguageModelV2({ doGenerate: [lookup(adaRef), response([{ type: 'text', text: 'Done.' }], 'stop')] });
    await answerCoverageQuestion('Is Ada covered?', model);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('member-ada');
  });

  it('feeds the coverage lookup result into the following model step', async () => {
    const model = new MockLanguageModelV2({ doGenerate: [lookup(adaRef), response([{ type: 'text', text: 'Ada is active.' }], 'stop')] });
    const result = await answerCoverageQuestion('Is Ada covered?', model);
    expect(result.steps).toHaveLength(2);
    expect(JSON.stringify(model.doGenerateCalls[1])).toContain('Ada Rivera');
    expect(JSON.stringify(model.doGenerateCalls[1])).toContain('active');
  });

  it('returns the final text supplied by the model after the tool loop', async () => {
    const model = new MockLanguageModelV2({ doGenerate: [lookup(adaRef), response([{ type: 'text', text: 'Ada Rivera has active coverage.' }], 'stop')] });
    await expect(answerCoverageQuestion('Is Ada covered?', model)).resolves.toMatchObject({ text: 'Ada Rivera has active coverage.' });
  });

  it('enforces the two-step cap when the model would otherwise keep calling the tool', async () => {
    const spy = vi.spyOn(core, 'lookupCoverage');
    const model = new MockLanguageModelV2({ doGenerate: [lookup(adaRef), lookup(adaRef), lookup(adaRef)] });
    const result = await answerCoverageQuestion('Keep looking up Ada', model);
    expect(result.steps).toHaveLength(2);
    expect(model.doGenerateCalls).toHaveLength(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('rejects an unknown-member-id input shape before lookupCoverage touches the backend', async () => {
    const spy = vi.spyOn(core, 'lookupCoverage');
    const model = new MockLanguageModelV2({ doGenerate: response([{ type: 'tool-call', toolCallId: 'bad', toolName: 'lookupCoverage', input: '{"memberRef":"member-ada","unexpected":true}' }], 'tool-calls') });
    await expect(answerCoverageQuestion('Look this up', model)).rejects.toThrow(/unrecognized|validation|invalid/i);
    expect(spy).not.toHaveBeenCalled();
  });
});
