# Requirements and Acceptance Criteria

The specification this lab is built to satisfy. It exists so that "is the lab
finished?" is a decidable question rather than an open-ended review. Anyone
auditing this lab should evaluate it **against this file only**.

Scope is frozen. Criteria may be marked failing; new criteria should not be
added without a deliberate decision to reopen scope.

## 1. Purpose

A senior full-stack TypeScript engineer with **no prior LLM-agent experience**
(but who has built MCP servers) needs, inside a two-week interview-preparation
window, to be able to honestly say they have built a governed, approval-gated,
tool-calling agent — and to defend the design decisions in conversation with
engineers whose product is exactly that.

The lab is a **teaching artefact**, not a product, not a framework, and not a
reference implementation.

## 2. Functional requirements

- **R1 — Agent fundamentals.** Teach what an agent is: a model in a loop with
  tools, multi-step chaining, step limits, and tool errors as model input.
- **R2 — Governed execution.** Teach the full chain: propose → authorise →
  persist → approve out-of-band → revalidate → execute → receipt → audit.
- **R3 — Data boundary.** Teach a model-facing representation that is safe by
  construction under a compliance constraint: allowlist projection, tokenised
  references, scrubbed errors, and injection carried in real backend text.
- **R4 — Evaluation.** Teach separating deterministic assertions from scored
  quality, and trajectory evaluation over final-output evaluation.
- **R5 — Interface.** Teach streaming as an event protocol and the UI as part of
  the governance surface.
- **R6 — Composition.** Prove the above fit together via one end-to-end slice.

## 3. Constraints

- **C1** — Completable in ~14 hours, alongside other interview preparation.
- **C2** — Runs free and offline. No API key required for any test.
- **C3** — Optional live mode, with at least one zero-cost provider path.
- **C4** — TypeScript throughout, on the pinned stack (`ai@5.0.257`, `zod@3.25.76`).
- **C5** — No real company names anywhere (repo-wide rule, root `CLAUDE.md`).
- **C6** — The learner implements the lessons; the lab does not implement them.

## 4. Acceptance criteria

Each is objectively checkable. `PASS` requires evidence, not plausibility.

### Structural

| # | Criterion |
|---|---|
| A1 | `npx tsc --noEmit` passes in `agent_lab/` and `agent_lab/ui/`. |
| A2 | On a fresh clone, foundation tests pass and every exercise test fails with a message naming the missing behaviour and its stage. |
| A3 | Files the learner is given are implemented and tested; files the learner builds throw `TODO Stage NN`. No file is ambiguously both. |
| A4 | One canonical name per concept. No parallel or duplicated contracts for the same thing. |
| A5 | The **governance chain** composes at runtime, not only via type imports: Stage 03's envelope is persisted by Stage 04's store, consumed by Stage 05's executor, wrapped by Stage 06's boundary, and driven end-to-end by Stage 08. |

### Test quality — the criterion that matters most

| # | Criterion |
|---|---|
| B1 | No test is satisfiable by a shallow or cheating implementation that skips the lesson the test claims to enforce. |
| B2 | Each test asserts against live values (backend state, revisions, computed hashes) rather than literals duplicated from fixtures, wherever the real value is obtainable. |
| B3 | Each failure mode is isolated in its own test, so a passing test proves a specific guarantee. |
| B4 | Security-relevant guarantees — authorisation, binding, idempotency, tenant isolation, boundary — each have at least one negative test. |

### Teaching

| # | Criterion |
|---|---|
| C1 | Every stage README's `## The idea` is ≥350 words and teaches the concept, not the API. |
| C2 | Every stage README contains a concrete worked scenario that is correct against the real code. |
| C3 | Every code snippet in a README matches the actual exported API. |
| C4 | Every stage README's `## Interview talking points` are claims defensible from code the learner wrote. |

### Experience

| # | Criterion |
|---|---|
| D1 | `npm run live:NN` exists for every stage and exits 0 with a useful message when no provider is configured. |
| D2 | Running live mode on an unimplemented stage gives an actionable message, not a stack trace. |
| D3 | At least one zero-cost provider path is wired and type-verified. |
| D4 | Stated completion time is within C1's budget. |

### Honesty

| # | Criterion |
|---|---|
| E1 | The lab states plainly what it does and does not qualify the learner to claim. |
| E2 | Known limitations are documented rather than implied to be solved. |
| E3 | No documented capability is unverified without being labelled as such. |

## 5. Non-goals

Explicitly out of scope. Their absence is **not** a defect, and an audit should
not report them as findings.

- Production infrastructure: distributed locking, real persistence, migrations,
  deployment, horizontal scale.
- A real authentication or session system.
- Breadth across agent capabilities: RAG, long-context memory management,
  multi-agent handoff, planning architectures.
- Framework coverage: LangGraph, OpenAI Agents SDK and Mastra are referenced for
  context; the lab does not teach them.
- Production-grade UI: reconnection, offline, accessibility audit, design polish.
- Adversarial completeness: the injection fixtures demonstrate the class, they
  are not a red-team suite.
- Real-provider integration testing.

## 6. Accepted limitations

Consciously accepted. Documented in-lab rather than fixed.

- **Single-process idempotency.** The `claimExecution` contract specifies the
  atomicity a real system needs; the in-memory implementation cannot provide it
  across processes. Taught as an explicit distinction.
- **Mock-model determinism.** Tests script model behaviour, so the lab teaches
  governance plumbing rather than model unpredictability. Live mode is the
  designated counterweight.
- **The live path has never made a real API call from this repo.** Provider
  wiring is type-verified only.
- **`ai@5.0.257` predates the built-in `toolApproval` API.** The lab hand-rolls
  approval and maps it to the framework version in Stage 07.
- **Stage 08 cannot pass until Stages 03–06 are implemented.** Intended.

## 7. Definition of done

The lab is done when every acceptance criterion in §4 passes, or fails only for
a reason recorded in §5 or §6.

At that point **stop**. Further review will always surface refinements; absent a
criterion it violates, a refinement is scope, not a defect. The learner's time is
better spent implementing Stage 01 than polishing the lab further.
