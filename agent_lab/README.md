# Governed Agent Lab

A hands-on TypeScript lab for building an LLM agent that is allowed to **take
real actions** — and is governed while doing it.

If you have built MCP servers, you already know the tool side of this protocol.
What is new here is the other half: the model-driven loop that *proposes* tool
calls, and everything you must put between that proposal and a real write.

The central idea is **governed execution**. A model may suggest an action but
never receives the authority to perform one. Identity, tenant, policy, approval,
execution and an auditable receipt all live outside the model. By the end you
will have built that chain yourself rather than read about it.

The domain is a fictional health-insurance payer system — members, enrollment,
coverage, benefits, claims. No real company data.

## Setup

```sh
cd agent_lab
npm install
npx vitest run          # 113 tests: 29 pass, 84 fail — this is correct, see below

cd ui && npm install && npm test   # Stage 07, separate Next.js package
```

**Most tests fail on a fresh clone, by design.** They are the exercises. Every
failure carries a `TODO Stage NN` message naming what is missing. The 29 passing
tests are the foundation you are given. You are done with a stage when its tests
go green.

Nothing here needs an API key. Tests inject deterministic model mocks, so the
entire lab is completable offline and for free.

## What you are given vs. what you build

This distinction matters — do not start by reimplementing things that already work.

**Given, fully implemented, with passing tests:**

| Path | What it is |
|---|---|
| `src/backend/` | The fake payer core: members across two tenants, dependents, plans, claims, service notes. Revisioned writes, injectable latency and failures. |
| `src/shared/action-envelope.ts` | The governance contract — discriminated action type, structured preview, `computeBindingHash`, `canonicalise`. |
| `src/shared/authorization.ts` | Actor registry and `authorizeAction`, returning discriminated failure reasons. |
| `src/shared/approval-store.ts` | The `ApprovalStore` interface Stage 04 implements and Stage 05 consumes. |
| `src/shared/member-ref.ts` | The model-facing reference seam. |
| `src/shared/stream-protocol.ts` | The server-owned NDJSON event protocol the UI renders. |
| `src/shared/model.ts`, `*/live.ts` | Provider selection and live-mode runners. |

**You build:** every `agent.ts` under `src/stages/`, and the route, page and
components under `ui/`.

## How to use the lab

1. Read the stage README. The `## The idea` section is the actual teaching —
   it is not preamble, and skipping it wastes the exercise.
2. Open that stage's `agent.ts` and make its failing tests pass.
3. Run `npm run live:NN` to watch a real model do the same thing, and see where
   it diverges from your mocks.

Do the stages in order. Each one's contracts are consumed by the next.

## Stages

| Stage | Directory | Time | What it teaches |
|---|---|---|---|
| 01 | `stage_01_first_tool` | ~1h | A tool call is a *proposal*, not an authorisation |
| 02 | `stage_02_agent_loop` | ~1.5h | Multi-step chaining, step limits, tool errors as model input |
| 03 | `stage_03_propose_not_execute` | ~2h | The action envelope; authorisation lives outside the model |
| 04 | `stage_04_human_approval` | ~2h | Approval as a persisted state transition, bound to exact arguments |
| 05 | `stage_05_execute_and_receipt` | ~2h | Revalidate at execution, atomic idempotency, auditable receipts |
| 06 | `stage_06_data_boundary_and_evals` | ~2h | Allowlist projection, tokenisation, trajectory evals, injection defence |
| 07 | `stage_07_approval_ui` | ~2h | Streaming as an event protocol; the interface *is* the governance. Lives in [`ui/`](ui/) |
| 08 | `stage_08_capstone` | ~2h | End-to-end composition — the proof the rest actually fits together |

Roughly 14 hours. Stages 01–03 are one evening and carry most of the
conceptual payload; if you only have one sitting, do those.

## How the stages compose

```text
prompt → member ref → proposal → envelope → store → decision → execute → receipt → audit → UI
         Stages 01+   Stage 03   shared     Stage 04  Stage 04   Stage 05   Stage 05  Stage 04/05  Stage 07
```

The member-reference seam starts in Stage 01 as a deliberately non-secret
pass-through. Stage 06 swaps in a tokenising resolver implementing the same
interface — **no tool signature changes** — and wraps every model-facing hop.
Stage 08 composes the whole route.

**Stage 08 cannot pass until Stages 03–06 are implemented.** That is the point.
Correct-looking type imports are not proof that proposal, approval, execution
and data-boundary contracts actually work together; only a vertical slice is.

## Live mode

Optional, and worth doing. Live mode exists to watch a real model do something
your mocks never would — pick the wrong tool, invent an argument, ignore an
instruction on the third turn. Those are the stories worth having.

```sh
npm run live:01   # … through live:06 and live:08
npm run live:07   # prints the UI instruction — Stage 07 is a web app
```

A runner prints the prompt, every tool call and result, step counts, and — from
Stage 03 on — the envelope preview, state transitions, receipt and audit trail.
Stage 08's runner prints the full slice as a timeline.

Running a stage you have not implemented prints a message telling you to make
its tests pass first. It will not crash.

### Providers — two of the three cost nothing

```sh
# Free, local, no key, no network.
ollama pull qwen3
OLLAMA_MODEL=qwen3 npm run live:01

# Free tier. A key, but no payment method for normal usage.
GOOGLE_GENERATIVE_AI_API_KEY=... npm run live:01

# Paid. $5 minimum prepay; the whole lab costs well under $1 on a small model.
ANTHROPIC_API_KEY=... npm run live:01
```

Force one with `AGENT_LAB_PROVIDER=ollama|google|anthropic`; otherwise the first
configured provider wins, preferring free. Override models with `OLLAMA_MODEL`,
`GOOGLE_MODEL` or `ANTHROPIC_MODEL`. A gitignored `.env` works and is loaded
only when present.

The Google default is `gemini-2.0-flash`, confirmed present in the installed
`@ai-sdk/google` model-id union and returning a model type compatible with
`ai@5`. It has not been exercised against the live API from this repo — if it
misbehaves, set `GOOGLE_MODEL`.

**If a local model ignores your tools entirely, that is the model, not your
code.** Small local models are frequently bad at tool calling — use `qwen3`,
`llama3.1` or `mistral-nemo`. Expect worse tool selection than a frontier model,
and treat that as a lesson about capability-dependent agent design rather than a
bug.

## After the lab

Read LangGraph's `interrupt()` docs for durable approvals, the AI SDK's
`toolApproval` docs, and Anthropic's *Building effective agents*.

Note that `ai@5.0.257` — the version pinned here — does **not** include the
built-in `toolApproval` / `addToolApprovalResponse` API described in current AI
SDK docs. This lab hand-rolls the approval protocol instead, which is the more
useful thing to have done: you can explain what those APIs abstract, and why.
Stage 07's README maps your implementation onto the framework version.

## What to claim in an interview

This is a lab, not production experience. Be precise about that — at a company
building agents, overclaiming dies on the first follow-up question.

Say: **"I built a governed tool-calling agent to understand the problem shape."**

You can then defend, from your own code:

- why a write tool that mutates on call collapses intent, authority and
  execution into one step
- why an approval is a persisted state transition that must bind to the exact
  structured preview and record revision a reviewer saw
- why execution revalidates rather than trusting an approval, and what revision
  drift does to a naive implementation
- why the model-facing data representation must be safe by construction, and why
  an allowlist fails closed where a denylist fails open
- what you assert deterministically versus what you score, and why an LLM judge
  must never guard a hard requirement
- why the reference seam was designed in at Stage 01 so that hardening it at
  Stage 06 was a substitution rather than a refactor

Do not imply you have operated such a system at scale, held a security
certification, or run a regulated platform in production.
