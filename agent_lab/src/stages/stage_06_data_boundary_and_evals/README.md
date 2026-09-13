# Stage 06 — Data boundary and evals

**Time:** ~2 hours
**You will learn:** Safe model inputs and deterministic evaluation must be designed, not prompted into existence.

## The idea

### Part A — The data boundary

You cannot prompt a model into not leaking sensitive data. Instructions are useful behavior guidance, but they are not a security boundary: the representation supplied to the model must be safe by construction. Project backend records through an explicit allowlist, never a denylist. A denylist fails open: when somebody adds `emergencyContact` to `Member`, that field silently reaches the model unless they remembered to blacklist it. An allowlist fails closed: only `memberRef`, plan, and coverage status exist in the model view. For example, adding a new `benefitEligibilityReason` backend field changes nothing until a reviewer deliberately permits it.

The model should receive a deterministic opaque reference such as `member_ref_7c91`, while the server resolves it to the raw member identifier only at execution time. Determinism lets a model refer consistently to one record during a run, but requires care: scope tokens by tenant, prevent collisions, and remember that a stable token is itself a correlation identifier. It is non-reversible only without the server-side resolver, not magically anonymous. In a coverage lookup, the model can request a status change using the reference; the authorization layer resolves it under the requesting tenant and rejects a reference belonging elsewhere.

The reference seam was already present in the earlier stages, where a deliberately non-secure pass-through resolver established the model-facing shape. Hardening it here changes no tool signature: the tokenising resolver is a drop-in replacement for the same `toRef`/`fromRef` contract. That is what a boundary designed in feels like rather than one bolted on after callers have learned to pass raw IDs.

The boundary includes routes engineers often forget: logs, traces, error messages and stack traces, analytics, and eval datasets. Eval datasets are especially easy to miss because they get committed to the repository and copied into CI. Imagine `lookupCoverage` throws `Member Ada Rivera was not found`; if an agent catches that exception and appends it as a model tool message, Ada's name has crossed the boundary despite a clean normal projection. `safeError` must replace that backend detail before it becomes model content. Likewise, a guard must inspect every model-bound tool result, prompt attachment, and argument payload.

### Part B — Evals

With a non-deterministic component, separate what you assert from what you score. Hard requirements are deterministic assertions: select the correct tool, send the correct arguments, require approval, execute nothing before approval, emit exactly one receipt, and expose no sensitive value in anything model-bound. Quality—clarity, empathy, or usefulness—may be scored, and only there is an LLM judge appropriate. Using a judge for a hard requirement makes the safety property itself non-deterministic. A regression should never be accepted because a judge happened to be generous that day.

Use trajectory evaluation for action-taking agents. Judging final text alone misses every failure that matters: an agent may write “Your coverage change is awaiting review” while it actually called an execution tool before approval. That trajectory must fail even with a perfect final answer. When an eval fails, first locate the failed invariant and inspect the recorded tool calls, arguments, receipts, and model messages; then decide whether the implementation, expected case, or model behavior changed. Promptfoo is a practical next step for local adversarial and regression runs, while Braintrust supports broader trajectory experiments beyond this lab.

## What you are building
Part A: project backend records through an explicit allowlist, tokenise and resolve references server-side, scrub errors, and route actual tool results through the model-facing boundary. Build a reusable `createBoundaryRecorder` rather than a black-box agent runner: it wraps registered tools, records the exact arguments passed to those tools and the exact safe results they return, and records the exact messages passed into an injected model callback. The caller receives both the wrapped tool result and the trace from that same execution, so it cannot honestly pair a proposal from one run with a fabricated safe trace from another. `runBoundaryAgent` remains only a convenience runner; when used, it accepts the resolver and tool set it must actually wrap and returns `toolResults` alongside `BoundaryRun`. Part B: add real backend-backed injection cases, then implement `runTrajectoryEval` with per-case and aggregate metrics for every deterministic safety invariant.

## Run it
```sh
npx vitest run src/stages/stage_06_data_boundary_and_evals/
```

## Key APIs
```ts
const policy = createMemberPolicy(tokens);
const view = project(member, policy);
const result = modelFacingToolResult('lookupCoverage', view, sensitiveValues);
const recorder = createBoundaryRecorder({ sensitiveValues });
const [lookupCoverage] = recorder.wrapTools([{ name: 'lookupCoverage', execute }]);
const member = await lookupCoverage.execute({ memberRef });
const modelResult = await recorder.callModel(messages, modelCall);
const trace = recorder.trace(); // trace and member are from the same wrapped run
const report = runTrajectoryEval(cases, trajectories);
```

## Watch out for
- New backend fields must never enter the projection until explicitly allowlisted.
- Scrub backend errors before a model can observe them.
- Injection text from a backend note remains visible as data; it is never authorization to bypass governance.
- A trace is evidence only when the recorder, model callback, and wrapped tools share one execution path.

## Interview talking points
- I use a model-facing allowlist and server-side token resolution instead of hoping prompts protect data.
- I include logs, errors, analytics, and eval fixtures in the data boundary.
- I assert safety deterministically and reserve LLM judges for qualitative scoring.
- I evaluate trajectories because unsafe behavior can be invisible in final text.
