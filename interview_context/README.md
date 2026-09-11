# Interview Context

This directory stores job-specific research and preparation material that can guide
the generation of realistic practice problems. It is context for the practice
catalog, not a second problem registry.

## Layout

Each target role gets its own directory:

```
interview_context/
  <role-slug>/
    interview-brief.md       # company, role, evidence, signals, unknowns
    job-description.md       # captured or normalized job description
    crash-course.md          # time-boxed preparation plan
    strategy.md              # durable preparation strategy and priorities
    source-notes.md          # optional URLs, dates, and research provenance
```

Use `interview_context/_template/` when adding another role. Keep raw job
descriptions and role-specific claims here rather than in a problem stub or in
the global `CLAUDE.md`.

## Generation contract

When generating a problem for a target role:

1. Read the role's `interview-brief.md`, `job-description.md`, and
   `crash-course.md` first.
2. Translate role signals into a practice slice: language, interface, domain,
   data model, failure modes, and expected discussion topics.
3. Keep company names and proprietary details out of the generated problem.
   Use a generic industry or product setting instead.
4. Create the normal stub, tests, answer path, and `data.js` entry using the
   repository conventions. Context should shape the problem, not bypass those
   conventions.
5. Record the source context in the problem description or generation notes
   only when it improves future maintenance; do not expose confidential details.

The role context is allowed to influence scenario and follow-up questions, but
the resulting exercise must stand on its own as a fair interview practice
problem.