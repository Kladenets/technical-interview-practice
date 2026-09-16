# Interview Context

This directory stores job-specific research and preparation material that can guide
the generation of realistic practice problems. It is context for the practice
catalog, not a second problem registry.

## Layout

Each target role gets its own directory:

```
interview_context/
  <role-slug>/
    interview-brief.md       # thesis, evidence, interview-process table, signal map, strengths, gaps
    job-description.md       # captured or normalized job description with source provenance
    crash-course.md          # signal-ordered plan + repo-fit mapping + problems to generate
    strategy.md              # durable through-line claims and preparation priorities
```

Use `interview_context/_template/` when adding another role. Keep raw job
descriptions and role-specific claims here rather than in a problem stub or in
the global `CLAUDE.md`.

## Two preparation surfaces

A role folder feeds **two** downstream systems, and onboarding a role is not
complete until both are considered:

1. **Testable coding practice** — the problem catalog (`data.js` + the
   `python/`, `typescript/`, `react/`, `golang/` trees). The crash-course's
   "How this repository fits" table maps role signals to existing problems, and
   "Problems to generate" names the gaps.
2. **Non-testable conversational practice** —
   [`interview_prep/`](../interview_prep/): system design, experience stories,
   philosophy, leadership, AI tooling, self-assessment, product collaboration.
   Prompts there carry a `Context: <role-slug>` tag so a role's question bank can
   be filtered. See [`interview_prep/AGENTS.md`](../interview_prep/AGENTS.md)
   § "Role-targeted prompts".

For loops with **no coding round**, surface 2 is the more important one. Never
onboard a role by building only the coding-catalog mapping — audit and tag the
`interview_prep/` prompts too.

## Canonical style

`mongoose/` is the reference standard for tone, structure, and depth. When
authoring or upgrading a role folder, match its conventions:

- A thesis-driven `interview-brief.md` with a **Working thesis**, **Role
  evidence**, an **Interview process** stage table, an **Interview signal map**,
  **Strengths to lean on**, **Known gaps**, **Questions to ask them**, and
  **Unknowns to resolve**.
- A `strategy.md` built around a small number of durable **through-line** claims
  carried across every stage, not a topic checklist.
- A `crash-course.md` ordered by **interview signal per hour**, including a
  **"How this repository fits"** table that maps each interview signal to an
  existing catalog problem, a **"Problems to generate"** section for gaps the
  catalog does not yet cover, and references to the role's tagged
  `interview_prep/` prompts (by category and number) for the conversational
  stages.

Prefer opinionated, quantified, evidence-backed prose over generic coverage.
Every abstract claim should have a concrete incident, project, or source behind
it.

## Inputs required

Before scaffolding a role folder, collect from the candidate:

- **Job posting** — URL plus a captured/normalized copy of the text (postings
  expire), requisition ID, dates, location, and compensation if listed.
- **Recruiter or founder call notes** — team size and shape, interview stages and
  format, tooling, ways of working, comp and logistics, and anything said that is
  not in the public posting.
- **Product and company research** — the public product site and any secondary
  sources, captured with URLs and dates.
- **Stack and architecture signals** — languages, frameworks, data layer, infra,
  auth, and AI tooling.
- **Candidate's relevant experience** — resume or portfolio, so the signal map can
  pair each likely signal with the candidate's strongest evidence and name the
  real preparation gap.

If any of these are missing, ask for them before writing the brief rather than
inventing plausible detail. Record provenance (URLs + dates) in the brief's
sources so future maintenance can tell confirmed facts from inference.

## Generation contract

When onboarding a target role and generating its practice material:

1. Read the role's `interview-brief.md`, `job-description.md`, and
   `crash-course.md` first.
2. Audit existing coverage before proposing anything new: search `data.js` for
   the role's industry and tags, list which existing problems already exercise
   the role's likely signals, and record that mapping in the crash-course's
   "How this repository fits" table. Backfill the role's `companies` slug onto
   matching problems in `data.js` so the index reflects the coverage.
3. Cover the conversational surface too: audit
   [`interview_prep/`](../interview_prep/) for prompts whose subject matches the
   role's signals, tag the relevant ones with `Context: <role-slug>`, and
   generate new prompts for uncovered signals per
   [`interview_prep/AGENTS.md`](../interview_prep/AGENTS.md) § "Writing new
   prompts". Reference the resulting prompts from the crash-course. This step is
   mandatory even when the role has a coding round, and is the priority when it
   does not.
4. Translate role signals into a practice slice: language, interface, domain,
   data model, failure modes, and expected discussion topics.
5. Keep company names and proprietary details out of the generated problem or
   prompt. Use a generic industry or product setting instead.
6. Create the normal stub, tests, answer path, and `data.js` entry using the
   repository conventions. Context should shape the problem, not bypass those
   conventions.
7. Record the source context in the problem description or generation notes
   only when it improves future maintenance; do not expose confidential details.

The role context is allowed to influence scenario and follow-up questions, but
the resulting exercise must stand on its own as a fair interview practice
problem.