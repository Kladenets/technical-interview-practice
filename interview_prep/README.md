# Interview Prep

The non-testable half of interviewing. Write an answer, ask an AI to judge it,
track the score over time.

Categories: `system-design`, `experience-stories`, `engineering-philosophy`,
`agentic-development`, `leadership-and-influence`, `self-assessment`,
`product-collaboration`.

Default target level is **senior**. Prompts marked `Level: staff` are still
worth answering, but deprioritise them.

Some prompts carry a `Context:` field naming a role in
[`interview_context/`](../interview_context/) — they were shaped around that
role's brief. They are still generic questions; the context only influenced what
they ask about.

## Loop

1. **Pick a prompt** — `interview_prep/<category>/prompts/NN_<slug>.md`.
2. **Answer it** — write `answers/kk_answer_NN_<slug>.md`. Timebox it to the
   prompt's stated time; a rushed real answer is worth more than a polished
   unrealistic one. Include the frontmatter block (see `AGENTS.md`).
3. **Get judged** — prompt: *"Judge interview_prep/system-design/answers/kk_answer_03_realtime_collaboration.md"*.
   The AI writes a name-matched file into `judgements/`.
4. **Re-attempt** — fix the top gap, write `..._v2.md`, judge again, diff the
   `overall` score. The delta is the whole point; never overwrite a v1.

Dictating is fine — set `mode: spoken-transcript` and prose polish won't be
graded. It's closer to the real thing.

## Tutoring

Ad-hoc. *"Teach me consistent hashing, working knowledge depth."* Guides land in
`<category>/tutoring/` and end with suggested new prompts.

## Tracking progress

Judgement frontmatter is machine-readable:

```sh
rg -N '^(answer|overall|verdict|top_gap):' interview_prep/*/judgements/*.md
```

## Scoring, in one line

0–3 per dimension, anchored: 2 is the senior bar, 3 is staff and rare. The
grader is instructed to be blunt and to cite quotes — if it's being nice to you,
it's not following `AGENTS.md`.
