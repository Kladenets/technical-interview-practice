# System Design Notes

These notes are a personal, topic-oriented reference for ideas learned from system design study and later practice. Organize by the reusable concept, not by the chapter or course sequence where it first appeared.

## Purpose

Capture the developer's own notes in a form that is quick to scan before an interview:

- Preserve the original meaning, emphasis, examples, and uncertainty.
- Correct obvious spelling, grammar, and punctuation errors without rewriting the note into generic textbook prose.
- Group related ideas together even when they came from different course chapters.
- Make connections visible with links to related notes.
- Prefer a small number of useful topic files over a file for every individual thought.

## Layout

Use this shape unless the notes grow enough to justify a deeper grouping:

```
notes/
  AGENTS.md
  index.md
  fundamentals.md
  data-storage.md
  distributed-systems.md
  messaging-and-streaming.md
  reliability-and-operations.md
  api-and-service-design.md
  scaling-and-performance.md
  security-and-privacy.md
  system-design-patterns.md
  interview-method.md
```

The filenames are suggestions, not a closed taxonomy. Create a new file when a topic has a durable identity and would otherwise make an existing file hard to scan. Do not create a new file merely because a note came from a different course chapter.

## Topic selection

Classify each note by the concept it helps explain or the decision it helps make. Use the narrowest useful topic, then link to adjacent topics when the idea crosses boundaries. Typical distinctions:

- A storage technology belongs in `data-storage.md`; choosing it under a workload constraint may also link to `scaling-and-performance.md`.
- Retry, timeout, idempotency, and backpressure belong in `reliability-and-operations.md`; a queue-specific insight may also link to `messaging-and-streaming.md`.
- A reusable design such as an outbox or token bucket belongs in `system-design-patterns.md`, with links to the implementation concerns in other files.
- Interview framing, estimation, and communicating tradeoffs belong in `interview-method.md`, not in the technical topic file.

When a note spans several topics, place the full note where its main idea lives and add a short link or pointer from the other relevant file. Avoid duplicating the full note.

## Note format

Use plain Markdown. Topic files should have a descriptive title and concise sections. Add new material under the most relevant existing heading; create a heading when needed. A useful entry often looks like:

```markdown
### Short concept title

A faithful, lightly edited version of the developer's note. Keep concrete examples,
tradeoffs, questions, and personal phrasing when they carry meaning.

**Remember:** The one-sentence takeaway, when there is a clear one.

**Related:** [Other concept](other-topic.md#matching-heading)
```

Do not force every entry to have all three parts. Use `Remember` for a durable takeaway and `Related` when a real connection exists. Use `Question` or `Open point` when the developer is uncertain; do not silently resolve uncertainty or present a guess as fact.

## Index

Maintain `index.md` as a short table of contents, grouped by topic/domain. Each row should link to a topic file and describe what belongs there in a few words. Update it when creating, renaming, or removing a topic file. Do not turn it into a duplicate of every note heading.

## Provenance

Course or source references are useful when supplied, but they should support the note rather than determine its location. Add a compact source line only when it is known and useful, for example:

```markdown
_Source: Grokking the System Design Interview — Consistent Hashing_
```

Do not invent chapter names, URLs, quotes, or page numbers. Keep references to other notes as relative Markdown links.

## Editing rules

- Read the relevant topic file and `index.md` before editing.
- Prefer appending or making a small local reorganization over rewriting an entire file.
- Preserve the chronological order of thoughts within a section unless the developer asks for a reorganization.
- Keep entries skimmable: short paragraphs, bullets for lists, and headings that say what the idea is.
- Deduplicate only when two entries clearly express the same idea; merge carefully and preserve useful detail.
- Never add uncited facts from general knowledge as though the developer recorded them.
- If classification is genuinely ambiguous, ask a focused question before writing. Otherwise make the best reasonable placement and state it in the session summary.
- Do not edit files outside this notes directory unless explicitly asked.
