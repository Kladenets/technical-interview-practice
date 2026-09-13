import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { LanguageModel } from 'ai';

/**
 * Tests inject MockLanguageModelV2 instances from `ai/test` — they never call a
 * real provider and never need a key.
 *
 * Live mode is optional and provider-agnostic, because the point of running it
 * is to watch a real model misbehave, and that lesson does not depend on which
 * model it is. Two of the three options cost nothing.
 *
 *   AGENT_LAB_PROVIDER=ollama     free, fully local, no key, no network
 *   AGENT_LAB_PROVIDER=google     free tier, needs GOOGLE_GENERATIVE_AI_API_KEY
 *   AGENT_LAB_PROVIDER=anthropic  paid, needs ANTHROPIC_API_KEY
 *
 * If AGENT_LAB_PROVIDER is unset, the first provider with usable configuration
 * wins, preferring the free ones.
 *
 * Tool calling is required by every stage. If a local Ollama model ignores your
 * tools, it is the model, not your code — use a tool-calling-capable tag such as
 * `qwen3`, `llama3.1` or `mistral-nemo` before you start debugging the agent.
 */
export type LabProvider = 'anthropic' | 'google' | 'ollama';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1';

function resolveProvider(): LabProvider {
  const explicit = process.env.AGENT_LAB_PROVIDER as LabProvider | undefined;
  if (explicit) return explicit;
  if (process.env.OLLAMA_MODEL) return 'ollama';
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return 'google';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';

  throw new Error(
    'Live mode needs a provider. Cheapest first:\n' +
      '  free, local:  ollama pull qwen3 && OLLAMA_MODEL=qwen3 npm run live:01\n' +
      '  free tier:    GOOGLE_GENERATIVE_AI_API_KEY=... npm run live:01\n' +
      '  paid:         ANTHROPIC_API_KEY=... npm run live:01\n' +
      'Tests do not need any of these.',
  );
}

export function getLiveModel(): LanguageModel {
  const provider = resolveProvider();

  switch (provider) {
    case 'ollama': {
      const ollama = createOpenAICompatible({ name: 'ollama', baseURL: OLLAMA_BASE_URL });
      return ollama(process.env.OLLAMA_MODEL ?? 'qwen3');
    }
    case 'google': {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('Set GOOGLE_GENERATIVE_AI_API_KEY, or switch AGENT_LAB_PROVIDER.');
      }
      return google(process.env.GOOGLE_MODEL ?? 'gemini-2.0-flash');
    }
    case 'anthropic': {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Set ANTHROPIC_API_KEY, or switch AGENT_LAB_PROVIDER.');
      }
      return anthropic(process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514');
    }
    default:
      throw new Error(`Unknown AGENT_LAB_PROVIDER: ${provider}`);
  }
}

/** True when live mode can run. Use to skip live scripts rather than crash. */
export function liveModeAvailable(): boolean {
  try {
    resolveProvider();
    return true;
  } catch {
    return false;
  }
}
