---
name: record-sd-notes
description: "Use when the user shares system design study notes, asks to record or organize Grokking system design notes, or wants to build a skimmable topic-based reference in interview_prep/system-design/notes."
---

# Record System Design Notes

Turn an ongoing conversation into a maintained, topic-oriented set of personal system design notes.

## Working mode

Treat this as an interactive capture session, not a one-shot summarization task. The user may send one thought, several rough notes, corrections, or a follow-up connection at a time. After each batch:

1. Read `interview_prep/system-design/notes/AGENTS.md` and inspect the existing `index.md` plus the most relevant topic files.
2. Identify the main concept, the likely topic file, and any nearby notes that should be linked.
3. If the placement is clear, edit the smallest necessary set of files. Create a topic file when the concept has a durable identity and does not fit cleanly elsewhere.
4. Create or update `index.md` whenever the set of topic files changes.
5. Report what was recorded, where it lives, and the related notes linked. Then invite the user to send the next thought.

Keep the session open conceptually: do not treat each message as an isolated task, and do not stop after recording one batch unless the user says they are done.

## Fidelity

The notes belong to the user. Preserve their reasoning, examples, priorities, uncertainty, and useful wording. Make only light editorial corrections:

- Fix obvious typos, spelling, punctuation, and grammar.
- Break long rough text into headings or bullets when that improves scanning.
- Make implied references explicit only when the user's meaning is clear.
- Do not add textbook explanations, invented examples, conclusions, or confidence the user did not express.
- If a statement is ambiguous or may be technically wrong, preserve it as an open question or flag it for review rather than silently correcting its substance.

Do not over-summarize. A note that is specific and slightly rough is more valuable than a polished generic explanation.

## Classification

Organize by reusable topic or decision domain, not by the order of the course. Use the narrowest useful existing topic file. Typical destinations include:

- fundamentals and core distributed-systems concepts
- data storage and data modeling
- messaging and streaming
- reliability and operations
- API and service design
- scaling and performance
- security and privacy
- reusable system design patterns
- interview method, estimation, and tradeoff communication

Read existing headings before creating a new one. Prefer adding to an existing topic when the concepts are related. Create a new topic file only when the topic is coherent, likely to recur, and would make existing files less skimmable if added there. Topic filenames should be lowercase kebab-case and describe the domain, not the course chapter.

When one idea belongs to multiple topics, record it once in its primary home and add `Related` links or short pointers from the other topic files. Avoid duplicated full entries that will drift.

## Entry shape

Use the local notes contract. A typical entry is:

```markdown
### Descriptive concept title

Lightly edited version of the user's note.

**Remember:** One-sentence takeaway when useful.

**Related:** [Related concept](topic-file.md#heading)
```

Do not force a takeaway, source line, or related link when it would be artificial. Preserve an uncertainty with `Question` or `Open point`. Add a source line only when the user gave enough information to name it; never invent chapter names, URLs, or citations.

## Interactive questions

Ask a concise clarifying question only when it changes the file or topic placement materially, for example:

- the note could reasonably belong to two unrelated domains;
- the user is asking to preserve a claim whose intended meaning is unclear;
- a new topic file would be justified but its scope is uncertain.

Otherwise make a reasonable decision, record it, and tell the user what you chose. Do not interrupt capture for cosmetic preferences.

## Completion response

After writing, give a compact session update:

- `Recorded:` the concept and the file/heading;
- `Linked:` any related notes added or updated;
- `Open:` any uncertainty retained for later review.

Then ask for the next note in a natural, brief way. Do not dump the full contents of edited files unless requested.

## Boundaries

- Only edit files under `interview_prep/system-design/notes/` for this workflow.
- Never rewrite the whole notes collection for consistency unless explicitly asked.
- Never change the course structure, system-design rubric, answers, prompts, or judgements as part of note capture.
- Use relative Markdown links and keep links valid when adding cross-references.
