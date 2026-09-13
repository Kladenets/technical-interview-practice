# Stage 04 — Human approval

**Time:** ~2 hours
**You will learn:** An approval is a durable state transition, not a modal dialog.

## The idea
An approval is workflow state, not a button in a modal. An agent can propose a consequential change, return a useful response, and disappear long before a person reviews it. The decision may arrive after a deploy, a worker crash, or a process restart, so pending work must live in a durable store rather than a closure, request scope, or in-memory conversation object. Model the lifecycle precisely: `proposed` may become `approved`, `rejected`, or `expired`; only `approved` may become `executed` or `failed`; `rejected` and `expired` are terminal. That precision prevents a later executor from treating every decision as permission to act.

Expiry also needs an intentional representation. A store can materialise expiry by changing an overdue proposed action to `expired`, which makes audit history and terminal behaviour clear but requires a sweep or a read path that performs the transition. Alternatively, a read can compute that an action is expired from `expiresAt`, which avoids background work but leaves an ambiguous stored state and makes audit timing harder to explain. Whichever choice you make, approving an expired proposal must not be possible. A durable record should capture who approved or rejected it, when they did so, and a rejection reason, alongside append-only audit events.

Approval must bind to what the reviewer actually saw: the typed action, the complete structured preview, and the source record revision. Binding only arguments is insufficient when the preview describes effects or the source record has changed. Hashing a canonical structured representation prevents harmless object-key ordering from breaking a binding while detecting a changed field, preview, or revision. Otherwise a reviewer can approve “set Ada inactive while she is active at revision 1” and an executor can silently apply a different operation later. That is decorative approval rather than a meaningful control.

For example, at 09:00 a service representative proposes changing Ada’s coverage and stores the preview and revision 1. The agent returns immediately. At 11:00 a deployment replaces every process, but the stored proposal remains available. At 13:00, four hours after proposal, reviewer-1 opens that exact preview and approves it; the store records the reviewer and timestamp. AI SDK calls this kind of pause `toolApproval`; OpenAI Agents SDK exposes `needsApproval`, interruptions, and `RunState`; LangGraph uses `interrupt()` followed by `Command({ resume })`. Those frameworks persist or checkpoint the pause for you. This lab hand-rolls the state machine so its safety properties and failure modes are visible.

## What you are building
Implement `ApprovalStore` and its in-memory version. `requestApproval` persists an envelope as `proposed` and returns immediately. `decide` represents a reviewer acting later, out of band. Store a hash of the canonical typed action, complete structured preview, and source record revision, then implement `verifyBinding`. The hash is a compact commitment to the exact decision context, not merely a fingerprint of the tool arguments. Preserve this complete envelope subset when exporting durable state and restoring it after a restart, too; persistence must not quietly weaken the approval boundary.

## Run it
```sh
npx vitest run src/stages/stage_04_human_approval/
```

## Key APIs
```ts
await store.create(envelope);
await decide(store, actionId, 'approved', approverId);
await verifyBinding(store, actionId, envelope.action);
```

## Watch out for
- Never block an agent run while waiting for a human.
- Refuse expired and already-terminal actions.
- Ensure an approver belongs to the envelope tenant before recording a decision.

## Interview talking points
- An approval is persisted workflow state, not user-interface state.
- I bind approvals to the canonical action, structured preview, and record revision to prevent replay against changed input or decision context.
- I make proposal and decision independently durable because they are separated by unbounded time.
- I can explain how framework interrupts map to the same state machine.
