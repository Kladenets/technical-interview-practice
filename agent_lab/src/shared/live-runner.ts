import { liveModeAvailable } from './model.js';

export const LIVE_MODE_HELP =
  'Live mode needs a provider. Cheapest first:\n' +
  '  free, local:  ollama pull qwen3 && OLLAMA_MODEL=qwen3 npm run live:01\n' +
  '  free tier:    GOOGLE_GENERATIVE_AI_API_KEY=... npm run live:01\n' +
  '  paid:         ANTHROPIC_API_KEY=... npm run live:01\n' +
  'Tests do not need any of these.';

export function beginLiveStage(stage: string, prompt: string): boolean {
  if (!liveModeAvailable()) {
    console.log(LIVE_MODE_HELP);
    return false;
  }
  console.log(`\n=== Stage ${stage} live trace ===\n\nPrompt\n  ${prompt}\n`);
  return true;
}

export function printModelTrace(result: any): void {
  const steps = result?.steps ?? [];
  const toolCalls = steps.flatMap((step: any) => step.toolCalls ?? []);
  const toolResults = steps.flatMap((step: any) => step.toolResults ?? []);
  console.log(`Tool calls (${toolCalls.length})`);
  for (const call of toolCalls) console.log(`  ${call.toolName}(${JSON.stringify(call.input ?? call.args ?? {})})`);
  console.log(`\nTool results (${toolResults.length})`);
  for (const result of toolResults) console.log(`  ${result.toolName ?? 'tool'}: ${JSON.stringify(result.output ?? result.result ?? result)}`);
  console.log(`\nSteps\n  ${steps.length}`);
  console.log(`\nFinal text\n  ${result?.text || '(no final text)'}`);
  if (toolCalls.length === 0) {
    console.log('\nNote: the model returned no tool call. Use a tool-calling-capable model (for Ollama, try qwen3, llama3.1, or mistral-nemo).');
  }
}

export function printStructured(label: string, value: unknown): void {
  console.log(`\n${label}\n  ${JSON.stringify(value, null, 2).split('\n').join('\n  ')}`);
}

export function handleLiveError(stage: string, directory: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  if (/TODO Stage \d{2}/.test(message)) {
    console.log(`Stage ${stage} is not implemented yet. Make its tests pass first: npx vitest run ${directory}/`);
    return;
  }
  console.log(`Live provider/model error: ${message.replace(/\s+/g, ' ').slice(0, 360)}`);
  console.log('Check the provider key, rate limits, and that the selected model supports tool calling.');
}

export const sampleEnvelope = {
  schemaVersion: '1' as const,
  actionId: 'live-action-ada',
  tenantId: 'tenant-northstar',
  actorId: 'csr-7',
  toolName: 'proposeCoverageChange' as const,
  action: { type: 'coverage.change' as const, input: { memberId: 'member-ada', targetStatus: 'inactive' as const } },
  preview: { summary: 'Change Ada Rivera coverage from active to inactive.', changes: [{ field: 'coverageStatus', before: 'active', after: 'inactive' }] },
  recordRevision: 1,
  risk: 'high' as const,
  createdAt: '2026-09-12T00:00:00.000Z',
  expiresAt: '2026-09-13T00:00:00.000Z',
  idempotencyKey: 'live-ada-inactive',
};
