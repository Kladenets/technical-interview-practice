import { decodeStream, type GovernedMessagePart } from '../../src/shared/stream-protocol.js';

/** Consume a complete NDJSON response body and preserve the server's event order. */
export async function consumeGovernedStream(stream: ReadableStream<Uint8Array>): Promise<GovernedMessagePart[]> {
  return decodeStream(await new Response(stream).text());
}
