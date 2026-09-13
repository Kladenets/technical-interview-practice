# Stage 05 — Execute and receipt

**Time:** ~2 hours
**You will learn:** Approval is not permission to execute blindly.

## The idea
The gap between “approved” and “done” is where governed systems commonly fail. An approval authorises a specific candidate action at a point in time; it does not freeze the world or grant a permanent capability. Before execution, load the durable approval and check that it is still `approved`, unexpired, structurally valid, and still authorised. The member record may now have another revision, or the original actor may have had permission revoked. Rechecking these conditions makes the executor a policy boundary rather than a blind delivery mechanism for an earlier decision.

Idempotency is a first-class requirement because retries, double-clicks, worker crashes, and queue redeliveries are ordinary distributed-systems behaviour. A duplicate coverage change can be a real member-impacting incident even when the requested status appears harmless. An idempotency key should therefore return the original receipt, not perform another mutation. The important detail is atomicity: a read-then-write check lets two concurrent workers both observe no receipt and both execute. This lab tests the contract by racing independent executor call sites against one shared store, so the store must expose an atomic execution claim and the losing caller must return the winner's receipt. A module-level `Map<key, Promise<Receipt>>` or lock can make one process look correct, but it is not the guarantee being taught: separate workers, processes, or deployments do not share it. A real system needs a transaction, conditional write, or unique constraint around the key and durable result, plus a way for a loser to read or await that result.

A receipt is the durable artefact that explains the outcome. Its consumer determines its contents. A compliance reviewer needs enough evidence to prove what was authorised: action identity, approver, timestamps, binding hash, result, and backend reference. A support agent needs an understandable explanation of why a member’s coverage changed or why it did not, without guessing from logs. Record successful and failed outcomes accurately; a failed backend call must never leave a success receipt. Audit events then connect proposal, decision, execution, and any terminal failure into one reviewable timeline.

Consider a concrete timeline. At 09:00 a proposal previews Ada at revision 1, and at 09:05 a reviewer approves it. At 09:10 another authorised workflow changes the member, moving the backend to revision 2. When the approved action resumes at 09:15, it must detect revision drift, mark the action terminal with a distinguishable failure, and audit that result rather than overwrite newer data. Framework resumes add another hazard: LangGraph re-runs the node containing `interrupt()` from its top, so side effects belong after the interrupt or must be idempotent. The same ordering trap exists in hand-rolled workflows, where a resumed handler or redelivered job can repeat earlier work.

## What you are building
Implement `executeApproved`. Load the action, require `approved`, validate expiry, authorization, schema, preview freshness, and idempotency in that order. Execute via the backend adapter, write a receipt, and append ordered audit events. Backend failures become `failed` actions and audited failures, never successful receipts.

## Run it
```sh
npx vitest run src/stages/stage_05_execute_and_receipt/
```

## Key APIs
```ts
const receipt = await executeApproved(actionId, dependencies);
await dependencies.store.appendAudit({ actionId, event: 'executed', at: new Date().toISOString() });
```

## Watch out for
- Check the current backend record against the preview before mutation.
- Return the existing receipt for an idempotent retry.
- Audit failure, but do not create a receipt claiming success.

## Interview talking points
- Approval authorizes a candidate action; execution still requires fresh validation.
- I use idempotency keys to make retries safe rather than hoping retries do not occur.
- Receipts have consumers, which determines the audit details they retain.
- I place side effects after durable interrupts or make them idempotent.
