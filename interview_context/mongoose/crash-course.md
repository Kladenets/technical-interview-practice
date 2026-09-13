# Crash Course — Mongoose

A two-week plan, assuming the process runs about that long. Ordered by interview
signal per hour, not by topic coverage.

## Priorities

1. **Articulating how you build software.** Two of five stages are this, and
   there is no coding round to fall back on. Highest return.
2. **Working with product.** Two more stages, with the CEO and CPO.
3. **System design, conversational.** One CTO stage plus a possible short
   hands-on question.
4. **Agent literacy.** You have none hands-on. A small self-directed agent
   build in a separate repo fixes the floor.
5. **AI tooling fluency.** Already a strength — polish, don't grind.

## Week 1

**Days 1–2 — process and product.**
Answer `engineering-philosophy/07_how_you_build_software`, then
`product-collaboration/01_vague_brief_to_shipped_feature` and `04_driving_after_handoff`.
Get these judged before writing anything else; they set the baseline and the
gaps found here usually repeat across every other answer.

**Days 3–4 — build a basic agent, yourself, in a scratch repo.**
Follow any small tool-calling tutorial, then extend it. The goal is not a
polished result; it is that every decision is yours. Get to: a model proposing
a tool call, your code deciding whether to run it, and the result going back
into the conversation. Then make one write action require your explicit
confirmation before it executes.

The sentence worth carrying into the CTO conversation is *the model proposes,
the server authorises*. Having implemented that gap yourself, however crudely,
is worth more than a week of reading.

**Day 5 — system design, their shape.**
`system-design/07_agent_action_governance` under a real 45-minute timer. This is
their product rebuilt from first principles; if you can hold your own here the
CTO stage takes care of itself. Then `12_short_design_check` at 20 minutes to
practise the compressed format.

**Weekend — stories.**
`experience-stories` 01–04. These are the slowest to improve because they need
real recall, so start early and re-attempt across the fortnight.

## Week 2

**Days 6–7 — push that agent further.**
Add the things that make an action safe: record what was approved and check it
still matches at execution time, make a repeated request not double-execute,
and keep sensitive fields out of what you send the model. Then write a handful
of tests over it — some deterministic assertions, and one case where the model
does the wrong thing. That is what lets you answer "how do you test something
non-deterministic" from experience rather than theory.

**Day 8 — remaining design shapes.**
`system-design/11_compliance_data_boundary` and `10_multitenant_white_label_frontend`.
Frontend architecture at platform scale is where this role actually lives and is
the easiest of these to underprepare.

**Day 9 — AI as product.**
`agentic-development/07`, `08`, `09`. Pair them with the agent you built —
every answer should cite something you actually hit.

**Day 10 — fit and self-assessment.**
`self-assessment/07_why_this_stage`, `03_real_weakness`, `01_career_moves`.
Then `product-collaboration/02_product_scope_pushback` and `03`.

**Day 11 — re-attempt.**
Take the three lowest `overall` scores, write `_v2` answers, re-judge. The delta
is the real preparation.

**Day 12 — rehearsal.**
Say your answers out loud, timed. Record them if you can stand it. Written
answers that have never been spoken fall apart under a real clock.

## Daily floor

Thirty minutes minimum: one prompt answered, one judged, one weak answer
re-attempted. Consistency beats a heroic weekend.

## Do not

- Grind LeetCode. There is no coding round.
- Learn Flutter. Have a position on ramping onto it; that is enough.
- Read agent framework documentation instead of building. Writing the
  propose-then-authorise loop once teaches more than every blog post on the
  subject combined.
- Memorise answers. These score worse than thinking out loud, and the two
  founder conversations will expose a script immediately.
