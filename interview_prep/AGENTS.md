# Interview Prep — Judging Contract

Practice for the **non-testable** half of interviewing: system design, experience
stories, philosophy, leadership, AI tooling, self-assessment. Answers are prose;
an AI grades them against a rubric and writes a judgement file.

This file defines the rules that apply to **every** category. Each category's
own `AGENTS.md` defines only its rubric dimensions and failure modes.

## Layout

```
interview_prep/<category>/
  AGENTS.md      # rubric dimensions for this category
  prompts/       # NN_<slug>.md — question bank, read-only during practice
  answers/       # <prefix>_answer_NN_<slug>.md — the developer's response
  judgements/    # <prefix>_answer_NN_<slug>.md — name-matched grade
  tutoring/      # <slug>.md — ad-hoc guides, written on request
```

`<prefix>` is the per-developer namespace used across this repo (`kk_`, `cw_`,
`en_`). Re-attempts append `_v2`, `_v3` — never overwrite a previous answer, the
score delta is the point.

A judgement filename **must** exactly match the answer it grades. One answer,
one judgement.

## Target level

**The default target for this repo is `senior`.** Generate senior prompts and
grade against the senior bar unless explicitly told otherwise.

Levels: `below-mid` | `mid` | `senior` | `staff`.

Grade against the answer's `target_level` frontmatter, defaulting to senior.
Always report where the answer actually lands in `level_assessment` — including
when it lands *above* the target, since that is useful signal.

The `3 (staff)` anchor stays in every rubric even when targeting senior. It is
not the goal; it marks the ceiling so a strong senior answer is not mistaken for
an exceptional one. A senior-target answer scoring straight 2s is a pass.

## Writing new prompts

Prompts live in `<category>/prompts/NN_<slug>.md`, numbered sequentially from the
highest existing number in that folder. `<slug>` is snake_case and describes the
question, not the answer.

Format — keep it to 15–25 lines:

```markdown
# <Title>

**Level:** senior
**Time:** 30m
**Context:** <optional — interview_context slug this targets, e.g. mongoose>

<The question, 1–3 sentences, in the voice an interviewer would actually use.>

## Cover
- <3–5 bullets naming what the answer must address; each should map to a
  rubric dimension in this category's AGENTS.md>

## Stretch
- <1–2 bullets that push one level above the stated Level>
```

Rules:

- **`Level` is mandatory** and must be one of the four values above. Default to
  `senior`. Only write `staff` prompts when asked for them explicitly, or when
  the category genuinely has no senior-level version of the question.
- **`Time` must be realistic** for the stated level — system design 40–50m,
  stories and philosophy 15–25m. The timebox is part of the exercise.
- **`Cover` bullets are the scoring contract.** Every bullet must correspond to
  a rubric dimension. If a bullet maps to nothing in the category's rubric,
  either cut it or the rubric is missing a dimension.
- **Never name real companies** (repo-wide rule — see root `CLAUDE.md`). Use
  sector framing: health-tech payer platform, IoT fleet, dev-tools CI, fintech
  ledger. This applies even when a prompt is written for a specific target role.
- **One question per prompt.** If it needs "and also", split it.
- **No prompt should be answerable from theory alone.** A good prompt forces a
  specific decision, a named cost, or a real incident from the developer's own
  experience.
- Check the existing prompts in the folder first — vary the shape, don't write a
  near-duplicate of one already there.

### Role-targeted prompts

When generating prompts for a specific target role, first read that role's
brief in [`interview_context/`](../interview_context/). Use it to choose the
domain, system shape, constraints, and follow-up topics — then set `Context:` to
the role slug so the prompt can be filtered later. Keep the question itself
generic and portable; the context shapes what you ask about, never who you
name.

## Answer frontmatter

Answers should open with:

```yaml
---
prompt: 03_multi_region_writes
target_level: senior
date: 2026-09-12
time_spent: 35m
mode: written        # written | spoken-transcript
---
```

`mode: spoken-transcript` means it was dictated — do not penalise prose polish,
grade content only.

## Judgement output format

Write to `judgements/<same-filename-as-answer>`. Nothing else. Exactly:

```yaml
---
answer: kk_answer_03_multi_region_writes
category: system-design
date: 2026-09-12
overall: 1.8            # mean of dimension scores, 1 decimal
level_assessment: senior
verdict: borderline     # weak | borderline | solid | strong
top_gap: "Never stated a consistency requirement before choosing storage."
dimensions:
  requirements_and_scope: 2
  tradeoff_reasoning: 1
---
```

Then, in this order:

1. **`## Verdict`** — 2–4 sentences. What level this answer signals and why.
2. **`## Dimensions`** — one `###` per rubric dimension, each containing:
   - **Score:** `N/3 — <label>`
   - **Evidence:** a direct quote from the answer, or `none found`
   - **Present:** what the answer actually does
   - **Missing:** what a higher score required — **mandatory, never omit**
3. **`## Top 3 fixes`** — ranked, concrete, each rewriteable in one sitting.
4. **`## Rewrite of the weakest passage`** — quote their weakest 2–3 sentences,
   then show a senior/staff-grade version. This is the highest-value section;
   do not skip it.
5. **`## Follow-ups an interviewer would ask`** — 3–5 questions their answer
   invites, hardest first.

## Scoring scale

Anchored 0–3. Apply per dimension.

| Score | Label | Meaning |
|---|---|---|
| 0 | missing | No evidence, off-topic, or actively wrong. |
| 1 | partial | Names the topic but vague, unjustified, or incomplete. |
| 2 | solid | Specific, defensible, independently meets the senior bar. |
| 3 | staff | Proactive and cross-cutting; creates leverage beyond the task. |

Verdict bands by mean: `<1.0` weak, `1.0–1.7` borderline, `1.8–2.4` solid,
`≥2.5` strong.

## Anti-inflation rules

These exist because AI graders default to flattery. Follow them literally.

- **No evidence, no credit.** Every score cites a quote from the answer or is
  scored 0. Never infer reasoning the candidate did not write down.
- **Naming ≠ knowing.** Mentioning Kafka, STAR, "tech debt", or "I use AI for
  boilerplate" scores 1 at most unless tied to a requirement and a consequence.
- **Never reward length, formatting, or vocabulary.** A short answer that
  carries the evidence outscores a long one that does not.
- **3 is rare.** Most good senior answers are 2s. If an answer averages ≥2.5,
  re-read it looking for what you let slide.
- **Impact ≠ scope.** A big metric on team-local work is senior, not staff.
- **Result ≠ ownership.** "We shipped it" is not evidence the candidate did.
- **Always populate Missing.** If a dimension scored 3, state what a follow-up
  question would still expose.
- Be blunt. No praise sandwiches, no "great job". The developer wants the gap.

## Tutoring mode

When asked to teach rather than grade, write to `tutoring/<slug>.md`. Ask the
depth first (**primer** ~1 page / **working knowledge** ~3 pages / **deep dive**,
no cap) unless stated. Every guide ends with a `## Practice` section proposing
2–3 new prompts for that category's `prompts/` folder. Do not grade in tutoring
mode; do not touch `answers/`.

## Rules for the AI

- Never edit files in `answers/`. That is the developer's own voice and the
  record being tracked. Suggest rewrites inside the judgement instead.
- Never edit or invent files in `prompts/` while grading.
- If an answer is missing frontmatter or references a prompt that doesn't
  exist, say so and grade what's there.
- Grade one answer per judgement file, even when asked to review several.
