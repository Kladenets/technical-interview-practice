# Stage 03 — Separate proposal from execution

**Time:** ~2 hours
**You will learn:** A consequential tool call must produce governed intent, not mutate a core system.

## The idea
This is the pivotal boundary in the lab. A write tool that changes coverage as soon as the model calls it collapses three different things into one step: the model's intent, the authority to act, and the actual execution. That is unacceptable for consequential actions. A model is useful for recognizing that a user appears to want a change and for filling a typed proposed action. It is not the system that decides whose tenant is involved, whether the actor has permission, whether a reviewer approves, or whether a stale change may be applied.

Instead, the tool returns an action envelope: a unit of evidence that can be reviewed and later executed under policy. It records the proposed typed action, the target record revision, the server-owned tenant and actor, risk and expiry, and what a human would see before approving. This is more than an audit sentence. Later stages can bind an approval to this exact evidence and reject execution if any relevant fact changes. The envelope lets independent components discuss the same proposed operation without trusting the model to remember or reproduce it faithfully.

Authorization must live outside the model. The model supplies intent such as “change member Ada to inactive”; trusted request context supplies the tenant, actor, and permissions. A model can include `tenantId: tenant-attacker` or an invented `actorId` in a tool argument, but those fields must not affect the envelope or policy evaluation. The server resolves identity from its authenticated context, checks the target belongs to that tenant, and invokes `authorizeAction`. This prevents a prompt, a tool description, or untrusted retrieved text from turning into cross-tenant authority.

The model receives a `memberRef`, not a backend member ID, even before the lab introduces real tokenisation. This is a design seam rather than a security feature in these early stages: the pass-through resolver is deliberately simple, but it forces every tool to resolve its input on the server. Stage 06 replaces that resolver with an opaque tenant-scoped one without changing a tool signature. Starting with the seam means later hardening fills an intended boundary instead of retrofitting a contradictory contract.

Make the reviewer preview structured data, such as `changes: [{ field, before, after }]`, rather than a pretty string. A string cannot be reliably compared, bound into an approval hash, or safely rendered in every client; typed fields can. Consider coverage active at revision N. The model proposes inactive, and the envelope records `before: active`, `after: inactive`, and revision N. Before approval, another process changes the record to revision N+1. If execution ignored the revision, approval for one state could silently apply to another. With a bound structured preview and revision, execution detects the mismatch and requires a fresh proposal and review.

## What you are building
Implement `proposeCoverageChange`. Resolve the member reference, validate the member and tenant, authorize the server-context actor, calculate an actual before/after preview, and return `ActionEnvelopeSchema` from `src/shared/action-envelope.ts`. It must not call the write service. Authorization is a shared policy helper, but the proposal tool must call it before it produces an envelope.

## Run it
```sh
npx vitest run src/stages/stage_03_propose_not_execute/
npm run live:03 # optional, needs ANTHROPIC_API_KEY
```

## Key APIs
```ts
const envelope = ActionEnvelopeSchema.parse({
  schemaVersion: '1', actionId, tenantId, actorId, toolName: 'proposeCoverageChange',
  action: { type: 'coverage.change', input: { memberId, targetStatus } },
  preview, recordRevision, risk, createdAt, expiresAt, idempotencyKey,
});
authorizeAction({ actor: actorId, action: { tenantId, action: envelope.action } });
```

## Watch out for
- Do not trust tenant or actor identity supplied by a model.
- A preview is not an execution and must leave state unchanged.
- Expiry and idempotency are prerequisites for safe later execution.

## Interview talking points
- A tool call is a model proposal, not an authorization.
- I separate model-controlled intent from server-controlled identity and policy.
- I use typed, expiring action envelopes as the unit of approval and audit.
- I test no-mutation as a first-class safety invariant.
