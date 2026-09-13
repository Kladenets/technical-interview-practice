import { describe, expect, it } from 'vitest';
import { encodeStreamPart } from '../../src/shared/stream-protocol.js';
import { consumeGovernedStream } from '../lib/stream-client';

describe('consumeGovernedStream', () => {
  it('decodes and preserves the lifecycle event order from a canned server stream', async () => {
    const wire = [{ type: 'text' as const, text: 'Preparing', state: 'streaming' as const }, { type: 'tool-call' as const, toolName: 'proposeCoverageChange' }].map(encodeStreamPart).join('');
    const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(new TextEncoder().encode(wire)); controller.close(); } });
    await expect(consumeGovernedStream(stream)).resolves.toEqual([{ type: 'text', text: 'Preparing', state: 'streaming' }, { type: 'tool-call', toolName: 'proposeCoverageChange' }]);
  });
});
