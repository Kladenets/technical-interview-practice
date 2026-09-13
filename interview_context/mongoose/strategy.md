# Strategy — Mongoose

## Source of truth

- Role-specific context: `interview-brief.md`, `job-description.md` in this
  directory.
- Current preparation priority: articulation over acquisition. There is no
  coding round. Every stage is a conversation, so the constraint is how
  precisely you can describe work you have already done — not new knowledge.

## The through-line

Three claims, carried across every stage:

1. **I take ambiguous product intent to shipped software without being
   managed.** Their literal hiring criterion.
2. **I think about consequential software in terms of boundaries — what the
   system decides versus what a person decides.** This maps onto governed
   execution and lands with the CTO.
3. **I use AI tooling heavily and I am calibrated about it.** Not an
   enthusiast, not a sceptic. Where it pays, where it does not, what verifies it.

If an answer does not reinforce one of these, it is filler.

## Planning rules

- Optimise for interview signal, not topic coverage.
- Replay weak answers before adding new prompts. A `_v2` that moves 1.2 → 2.1
  is worth more than three fresh answers at 1.4.
- Build before reading on anything agent-related. The lab is the differentiator;
  no amount of reading substitutes for having hit the problems.
- Every abstract claim needs a concrete incident attached. If you cannot name
  the project, the constraint and the outcome, the claim is not ready.
- Quantify or cut. Unquantified results read as mid-level.

## Known risk areas

- **No production agent experience.** Mitigated by the lab, not erased by it.
  Be precise about what you built and why; do not let enthusiasm turn a lab into
  an implied production system. Interviewers at an agent company will detect it
  instantly, and the honest version is genuinely impressive for two weeks' work.
- **Flutter/Dart unfamiliarity.** Have a ramp position ready. Do not learn it.
- **Startup-stage fit is assumed, not evidenced.** Wanting a startup is not the
  same as showing you have operated in ambiguity and breadth. Find the evidence.
- **Story recall.** The slowest thing to improve. Start early, revisit often.

## Review loop

- What improved? — compare `overall` in judgement frontmatter across `_v2`.
- What stayed weak? — recurring `top_gap` values across categories. A gap that
  appears in three categories is a habit, not a one-off.
- What gets replayed next? — the lowest two scores, always.

```sh
rg -N '^(answer|overall|verdict|top_gap):' interview_prep/*/judgements/*.md
```
