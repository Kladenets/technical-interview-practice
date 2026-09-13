# Stage 07 — Streaming approval UI

**Time:** ~2 hours
**You will learn:** A governed agent needs an interface that makes its state and authority legible.

## The idea
Streaming is an **event protocol**, not token soup. A response contains typed message parts as the model writes text, proposes a tool call, receives a result, or encounters an error. The UI's job is to render a state machine over those parts, not to print an ever-growing string. A text part can itself be streaming or complete; a tool call and result explain what the agent is doing; and an action event is an authoritative statement about the persisted action. The browser should preserve their order, but it does not invent their meaning.

The interface must distinguish streaming, proposed/awaiting-approval, approving, executing, executed, rejected, failed, and expired. Most demos render two of those eight states, and that is precisely why they feel untrustworthy. For a consequential action, the interface *is* the governance: an approve button that does not show exactly what will change is a rubber stamp with a nicer font. Render the full structured preview—each field, before value, after value, record revision, risk, and expiry—rather than reducing the action to a friendly sentence.

Each event maps to one visible UI state, and the server owns every transition. The server persists `proposed`, accepts a decision request, records an approval or rejection, starts execution, and finally emits either an executed action with a receipt or a failed outcome. The client may show that its decision is in flight, but an approval click is untrusted input, not authority. On receipt, the server re-validates the action, recomputes its binding hash over the input, preview, and revision, checks authorization and expiry, and only then executes.

Optimistic UI is wrong here. Never present an action as done merely because a reviewer clicked Approve; “done” is a claim only the receipt can make. Likewise, the preview shown to the reviewer must be the same preview that the approval binds to. If the UI renders a summary while the backend binds different arguments, Stage 04's approval chain is decorative. Receipt identity, timestamps, outcome, backend reference, and ordered audit events make the server’s claim inspectable instead of merely persuasive.

Consider a reviewer with the preview on screen while the underlying record moves from revision 41 to revision 42. Their click may reach the server after the proposal has expired, or the server may detect drift during execution. In either case, disable controls when the expiry event arrives, visibly explain that a fresh proposal is required, and never silently apply the old intent. A drift or revision-conflict outcome is a failed state with a scrubbed explanation, not an invitation for the browser to retry stale work.

This stage defines a server-owned, hand-rolled stream contract in [`shared/stream-protocol.ts`](../../shared/stream-protocol.ts). It builds on the persisted `PendingAction`, `Receipt`, and `AuditEvent` contracts introduced by Stages 04–05, but it is not itself produced by those stages. The companion [Next.js UI package](../../../ui/README.md) imports that shared discriminated union rather than inventing a frontend-only equivalent. Its wire encoding is NDJSON: each server event is one JSON object followed by a newline, and the client decodes and renders those records in their received order.

That ownership boundary is important. Stage 04 owns approval-state persistence and Stage 05 owns execution receipts; neither stage is a streaming transport. Stage 07 is where an HTTP route must turn model activity and those server facts into an explicit browser protocol. A browser may not manufacture `action-executed`, infer a successful receipt from an approval click, or reinterpret a random string as a valid binding hash. Conversely, the route must not leak the raw model transcript, backend member identifiers, internal names, or sensitive tool output merely because it is convenient to stream. The model-facing data boundary remains a server responsibility before an event reaches the wire.

The protocol includes text, tool-call, and tool-result parts as well as action-proposed, approval-decision, action-executing, action-executed, action-rejected, action-failed, action-expired, and scrubbed error parts. Each action lifecycle has a legal order: it begins proposed, may move through approval and execution, and then reaches one terminal result. A decoder validates the shape of every record; a lifecycle validator rejects impossible transitions. This means a component test can distinguish a real proposal stream from a static block of reassuring labels, and route tests can prove that an injected model actually invoked the Stage 03 proposal tool.

Use fixture streams only as deterministic examples of this server contract. They are useful for visual states and for tests without an API key, but they are not a substitute for the route. The real route must obtain tenant and actor identity from its server session, reject identity supplied by a browser payload, expose the constrained proposal tool to the injected model, obtain the target record's current coverage status and revision through the backend, compute the binding hash over the emitted action, preview, and revision, and serialize the scrubbed result as protocol events. Those checks make the exercise about governed streaming rather than about producing strings that happen to look plausible.

## The framework version

The installed `ai@5.0.257` package does **not** expose the newer built-in approval surface: there is no `toolApproval: { toolName: 'user-approval' }`, `addToolApprovalResponse()`, or message part with `state === 'approval-requested'` in its installed type declarations. Do not pretend those APIs exist or upgrade the lab to obtain them.

In a newer SDK, a tool approval request corresponds to this lab's persisted `PendingAction` in `proposed` state; the client response corresponds to `decide`; and a completed tool result maps to the receipt produced by `executeApproved`. The framework can transport the interrupt, but it does not remove the need to bind, revalidate, expire, authorize, and receipt the action.

## What you are building

In [`ui/`](../../../ui/), implement the `POST` streaming route using Stage 03's proposal tool, then render the shared protocol's message parts. Build `ActionPreview`, `ApprovalControls`, `ReceiptView`, and `MessageParts` against `ActionEnvelope`, `PendingAction`, `Receipt`, and `GovernedMessagePart`. Keep the page a streaming client: post only a prompt, read the NDJSON `ReadableStream`, decode each complete event, and append it in order. The fixtures and component tests use no API key; route tests inject a mock model and must demonstrate that its tool call drives the emitted proposal.

## Run it

```sh
cd ui
npm install
npm test
npm run typecheck
```

## Key APIs

```ts
import type { ActionEnvelope } from '../../shared/action-envelope.js';
import type { PendingAction } from '../stage_04_human_approval/agent.js';
import type { Receipt } from '../stage_05_execute_and_receipt/agent.js';
import type { GovernedMessagePart } from '../../shared/stream-protocol.js';
```

## Watch out for
- Approval identity and the bound input sent from a client are untrusted; the server must re-check both.
- The underlying record can change while a preview is visible, so execution must detect drift and return a failed outcome rather than applying stale intent.
- If an approval expires while the tab is open, disable its controls and explain that a fresh proposal is required.
- Treat malformed NDJSON or an illegal lifecycle transition as a protocol failure, not as UI state to guess at.
- Do not stream model-visible identifiers or backend details; emit only the scrubbed values the UI contract permits.

## Interview talking points
- Streaming UI is a typed event/state protocol, not a transcript renderer.
- I make consequential state explicit so a reviewer can distinguish proposed, approved, executed, and failed work.
- I do not use optimistic success for governed writes; the receipt is the success boundary.
- I render the server-bound preview and treat browser decisions as requests that require server-side validation.
- I use a server-owned typed stream contract so the UI renders facts and order supplied by governance code, not meanings invented in the browser.
