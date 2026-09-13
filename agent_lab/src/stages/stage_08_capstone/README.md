# Stage 08 — Governed action capstone

**Time:** ~2 hours  
**You will learn:** Governance only exists when the proposal, decision, execution, data boundary, receipt, and audit contracts compose in one path.

## The idea

The first seven stages can all pass while the system is still unsafe or incomplete. A proposal tool can create a beautiful envelope, an approval store can preserve a decision, an executor can check a revision, and a boundary can project safe data. Type imports between those pieces are not integration. Their assumptions may disagree about identity, expiry, hashes, error handling, or who writes audit events. Integration is where those contracts meet live state and are forced to agree; the seam between two individually correct components is where real governed systems most often fail.

A vertical slice is one complete, externally meaningful route through a system: from a prompt arriving at the server to a reviewer-visible receipt and UI state. It is more valuable here than seven partial demos because it proves that a model proposal cannot skip a decision, a decision binds the preview that was shown, and execution rechecks the world that may have changed since review. This stage deliberately imports the artefacts from Stages 03–06 instead of offering friendlier capstone replacements. Its tests will fail until those earlier stages are implemented; that dependency is the lesson, not a broken starter.

The audit trail is the system’s real output. A chat response is merely an explanation, while an ordered record must reconstruct what was proposed, what structured preview and revision a reviewer saw, who decided, why they rejected if they did, and what execution actually did. If the log cannot answer those questions, approval is theatre: an attractive button with no durable evidence of authority. Receipts make success inspectable and idempotency makes retried delivery safe; failed, expired, drifted, and unauthorized paths must be equally legible.

For example, a Northstar support worker asks to change coverage. Stage 06 owns the model boundary: it gives the model an opaque, allowlisted view, keeps free-text notes as data, records the exact messages supplied to the model, and wraps the registered tools so their actual arguments and returned results enter the same trace. Stage 03 owns the wrapped `proposeCoverageChange` tool: it resolves the recorded `memberRef` with that same resolver and creates the server-context envelope and preview. Stage 04 owns persistence, the `proposed` state, the independent reviewer decision, and approval binding. Stage 05 owns reload, reauthorization, revision and idempotency checks, the single payer-core mutation, receipt, and execution audit event. Stage 07 renders those persisted states. Stage 08 owns composition: it must consume the Stage 06 wrapped Stage 03 result, persist that exact envelope through Stage 04, and delegate execution to Stage 05. This makes the trace causal evidence rather than a separately assembled report.

This lab teaches the problem shape, not production operation. You can honestly say you built and tested a governed tool-calling workflow with approvals, data minimization, and trajectory assertions. You cannot claim you operated a production agent, satisfied a regulator, designed durable distributed locking, or secured a real healthcare platform. Production adds authentication infrastructure, durable transactions, observability, incident response, privacy review, load testing, retention policy, and adversarial operations that this intentionally small lab does not simulate.

## What you are building

Implement `createGovernedActionWorkflow`. Its seams are `submitPrompt`, `decide`, `execute`, and `auditTrail`. Use server session identity, Stage 03’s proposal tool, Stage 04’s `InMemoryApprovalStore` and decision helpers, Stage 05’s `executeApproved`, and Stage 06’s `createBoundaryRecorder` on every model message, tool argument, tool result, and surfaced error. Inject one Stage 06 `MemberRefResolver` into both the boundary model view and Stage 03 tool. `submitPrompt` must persist the envelope returned by that recorder-wrapped tool—not independently call Stage 03 then manufacture `modelTrace`. Do not create capstone-local envelope, store, authorization, or receipt types.

## Run it

```sh
npx vitest run src/stages/stage_08_capstone/
npx tsc --noEmit
```

## Interview talking points

- I tested a full governed action path, not disconnected helper functions.
- I separated model intent, server-derived identity, independent approval, and execution authority.
- I bind the reviewer-visible preview and revision, then revalidate authorization and state immediately before the write.
- I treat ordered audit history and idempotent receipts as product outputs, including failure paths.
- I tested drift, expiry, revoked permission, cross-tenant review, retries, backend failure, and prompt injection as workflow properties.
