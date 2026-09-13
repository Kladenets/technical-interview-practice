'use client';

import { FormEvent, useState } from 'react';
import { MessageParts } from '../components/MessageParts';
import type { GovernedMessagePart } from '../../src/shared/stream-protocol.js';
import { consumeGovernedStream } from '../lib/stream-client';

export default function AgentConsole() {
  const [prompt, setPrompt] = useState('Change member M-100 coverage to inactive');
  const [parts, setParts] = useState<GovernedMessagePart[]>([]);
  async function submit(_event: FormEvent<HTMLFormElement>) {
    // POST { prompt } to /api/chat, read its UI-message ReadableStream, and append each decoded part.
    // Actor and tenant are intentionally absent: the server obtains them from its session.
    // The extraction keeps the framing/parser independently testable. The completed
    // exercise will pass `response.body` and append each server-owned part here.
    void prompt; void setParts; void consumeGovernedStream;
    throw new Error('TODO Stage 07: consume the /api/chat UI message stream instead of a fixture');
  }
  return <main><h1>Governed agent console</h1><form onSubmit={submit}><label>Request <input value={prompt} onChange={event => setPrompt(event.target.value)} /></label><button type="submit">Send</button></form><MessageParts parts={parts} /></main>;
}
