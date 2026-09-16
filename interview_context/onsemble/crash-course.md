# Onsemble Crash Course

## Plan metadata

- Window: next 1–2 weeks; activate exact dates after the interview loop is confirmed
- Planned hours: 10–11 per week, Mon–Sat
- Primary context: `interview_context/onsemble/interview-brief.md`
- Sunday: off

## Outcomes

- Tell a precise, credible story about why Onsemble and why this role.
- Solve representative medium coding problems while narrating assumptions, tests, and tradeoffs.
- Design a small contractor/distribution workflow using React, Node/Express, Postgres, auth, and an async integration.
- Explain production incidents, customer-driven prioritization, and AI-assisted development with verification.
- Leave the first conversation with the interview stages, timing, and evaluation criteria clarified.

## Operating rules for this process

- Confirm the format, language, time limit, evaluator presence, and allowed tools before accepting a technical exercise.
- Do not accept a timed coding exercise with vague requirements and no human clarification path; request a live interviewer, written clarification channel, or untimed alternative.
- Keep the narrative specific: product-minded full-stack engineer who can turn business problems into technical plans and verify AI-assisted work before it ships.
- Treat the interview as a two-way evaluation of technical work, customer context, and how the team handles ambiguity.

## How this repository fits the preparation

The existing catalog is strongest for frontend behavior and standalone domain
logic. Use these problems as deliberate warmups and replays:

| Interview signal | Existing problem to tackle | What to practice saying |
|---|---|---|
| React state, optimistic updates, rollback | `react/practice_problems/problem_01_activity_feed.jsx` | Why server truth wins, how stale events are reconciled, and how the UI communicates failure |
| Filtering, sorting, inline editing | `react/practice_problems/problem_04_contract_dashboard.jsx` | Derived state, controlled inputs, mutation boundaries, and accessible user feedback |
| Polling, cancellation, live status | `react/practice_problems/problem_08_claims_tracker.tsx` | Effect cleanup, abort behavior, stale responses, and when polling should become a push model |
| Authorization and role hierarchy | `python/practice_problems/problem_03_permission_manager.py` | Authentication versus authorization, least privilege, and where checks belong in an API |
| Lifecycle modeling and auditability | `python/practice_problems/problem_08_enrollment_pipeline.py` | Explicit transitions, invalid states, metrics, and durable event history |
| Deduplication and event ingestion | `python/practice_problems/problem_09_incident_aggregator.py` | Idempotency keys, time windows, ordering assumptions, and operational visibility |

These exercises are preparation surfaces, not direct simulations of the
Onsemble stack. The repository does not currently have a Node/Express,
Postgres/Drizzle, Clerk, or TanStack Query problem, so those parts need focused
design drills and new exercises.

## Conversational prep (`interview_prep/`)

The non-testable stages — system design, product collaboration, AI-native
engineering, behavioral, and fit. Onsemble-specific prompts are tagged
`Context: onsemble`; generic prompts serve every role and stay untagged. Drill
the tagged ones first, then the generics.

| Interview signal | Prompt | Status |
|---|---|---|
| Self-service workflow design end to end | `system-design/13_self_service_field_service_workflow` | onsemble |
| Async/integration reliability (Lambda, webhooks) | `system-design/14_async_integration_reliability` | onsemble |
| Product judgment across divergent user classes | `product-collaboration/07_conflicting_user_classes` | onsemble |
| Fit: autonomous team inside a large company | `self-assessment/09_why_this_environment` | onsemble |
| Driving after handoff, scope negotiation | `product-collaboration/04_driving_after_handoff`, `02_product_scope_pushback` | generic |
| AI-native workflow, verification, when not to delegate | `agentic-development/01_end_to_end_workflow`, `02_confidently_wrong`, `03_not_to_delegate`, `04_reviewing_generated_code` | generic |
| Ownership, failure, incident stories | `experience-stories/01_hardest_technical_problem`, `04_project_slipped_or_failed`, `06_incomplete_information_call` | generic |
| Generic system-design range | `system-design/01_iot_telemetry_ingestion`, `06_multi_team_notification_platform` | generic |

Answer the four tagged prompts, get them judged, and replay the lowest two
before the loop. See `interview_prep/AGENTS.md` for the judging contract.

## Onsemble-specific problems to generate

Generate these only after replaying the existing problems above. Keep them
generic and do not use Onsemble, Hajoca, contractor, or Profit Center names in
the problem code or prompt. Each should use the normal stub, tests, answer path,
and `data.js` entry conventions.

### Priority 1: self-service work-order workflow

- Target: React/TypeScript, with a typed API boundary represented by fixtures or a mock service.
- Part 1: display role-scoped work orders with loading, empty, error, and stale states.
- Part 2: edit or submit a quote with optimistic UI, server validation, rollback, and query invalidation.
- Part 3: add tenant and role scope, conflict handling, and an audit timeline.
- Signals: React composition, TanStack Query reasoning, authorization boundaries, customer workflow judgment, and maintainable state transitions.

### Priority 1: idempotent integration event processor

- Target: TypeScript or Python domain problem; use system-design follow-ups for Express and Lambda deployment.
- Part 1: accept webhook events and reject malformed payloads.
- Part 2: deduplicate retries, enforce idempotency, and preserve event ordering where required.
- Part 3: add retry scheduling, dead-letter handling, backpressure, and observable failure states.
- Signals: API contracts, async boundaries, integration reliability, data modeling, and production ownership.

### Priority 2: multi-tenant workflow authorization service

- Target: TypeScript or Python.
- Part 1: model users, organizations, roles, and resource ownership.
- Part 2: evaluate role-scoped permissions for read, update, and administrative actions.
- Part 3: add inherited access, audit records, and safe behavior for deleted or transferred resources.
- Signals: Clerk-like identity handling, authorization versus authentication, least privilege, and auditability.

### Priority 2: operational search and answer-quality evaluator

- Target: TypeScript.
- Part 1: normalize documents and produce deterministic relevance-ranked results.
- Part 2: attach source references and filter results by tenant, freshness, and access scope.
- Part 3: score answer quality, detect unsupported claims, and fall back safely when evidence is weak.
- Signals: pragmatic AI feature design, grounding, privacy, evaluation, and knowing when not to trust generated output.

### System-design companion for all four

Practice explaining the same slice as a React/Vite client, Express API,
Supabase/Postgres/Drizzle data layer, Clerk authorization boundary, and AWS
Lambda or webhook integration. The repository can test the deterministic core;
the interview discussion should cover migrations, indexes, tenancy, retries,
observability, deployment, and user-visible failure states.

## Week 1: establish fit and technical fluency

### Monday — role narrative and baseline (1h 45m)

- Draft a 90-second introduction connecting IKEA, Proconex, and the portfolio to Onsemble.
- Write three versions of "Why Onsemble?": product, technical, and customer-impact angles.
- Solve one medium array/hash-map problem timed, then record the explanation and gaps.

### Tuesday — React and data fetching (1h 45m)

- Replay `react/practice_problems/problem_01_activity_feed.jsx`, then adapt it on paper into the Priority 1 self-service work-order workflow.
- Cover loading, empty, error, mutation, invalidation, optimistic-update, and stale-data behavior.
- Rehearse how the design changes for multi-tenant or role-scoped data.

### Wednesday — Node, APIs, auth, and tests (1h 45m)

- Use the Priority 1 work-order workflow as the API exercise and the Priority 2 authorization service as the follow-up.
- Specify input validation, Clerk identity/authorization checks, error taxonomy, idempotency, and tests.
- Refresh TypeScript narrowing, async error handling, and integration-test boundaries.

### Thursday — Postgres and integrations (1h 45m)

- Model the work-order workflow and then design the Priority 1 idempotent integration event processor.
- Discuss indexes, constraints, migrations, tenancy, auditability, and reporting queries.
- Add an AWS Lambda or webhook integration: retries, deduplication, observability, and backpressure.

### Friday — behavioral and AI-native practice (1h 45m)

- Prepare STAR answers for ownership, ambiguity, conflict, failure/recovery, and production incident.
- Use IKEA examples: 52-deployment migration, 27-market validation regression, SSR state leakage, and Vaka/MTTR.
- Explain how you use Claude Code or other agents: decomposition, boundaries, tests, review, security, and rollback.

### Saturday — mock and replay (2h)

- 45m practical coding mock: replay one existing problem, then complete one new Onsemble-specific problem part.
- 45m system-design mock: make a workflow self-service across contractors and distribution centers.
- 30m review: write what was weak, what evidence is missing, and the three questions for Nancy.

## Week 2: simulate the loop and sharpen gaps

### Monday — coding replay (1h 45m)

- Solve two previously missed medium problems from different patterns, including one existing React problem and one event or authorization problem.
- Emphasize clarifying questions, brute force first, complexity, edge cases, and clean tests.

### Tuesday — architecture communication (1h 45m)

- Design the Priority 1 work-order workflow end to end: React/Vite client, Express API, Supabase/Postgres/Drizzle, Clerk, async Lambda, and observability.
- Practice choosing what stays synchronous versus asynchronous and where failure is visible to users.

### Wednesday — customer discovery and prioritization (1h 45m)

- Role-play conflicting requests from a plumber, a distribution-center operator, and Hajoca leadership.
- Produce a prioritization decision with user impact, repeatability, evidence, risk, and a smallest useful slice.

### Thursday — production and AI quality (1h 45m)

- Run an incident drill involving bad data, an integration outage, an AI-generated regression, or unsupported search output from the Priority 2 evaluator.
- Explain detection, containment, diagnosis, communication, fix, test coverage, and prevention.
- Prepare a concrete example of an AI-assisted change that you would reject or heavily constrain.

### Friday — full behavioral and motivation rehearsal (1h 45m)

- Answer 8–10 likely questions aloud in two minutes each.
- Tighten every answer to context, owned actions, measurable result, and lesson.
- Practice questions about remote work, customer travel, autonomy, Hajoca integration, and first 90 days.

### Saturday — final simulation and handoff (2h)

- 45m coding or take-home-style implementation.
- 45m system design with follow-up pressure.
- 30m final review: strengths, risks, open questions, and a one-page interview-day sheet.

## Priority order if time collapses to one week

1. Role narrative, motivation, and five STAR stories.
2. Practical API/Postgres/system-design exercise.
3. React/TanStack Query feature reasoning.
4. AI-assisted development judgment and verification.
5. Four to six representative medium coding problems, replayed deeply.

## Completion checks

- Can explain one production incident with concrete impact and learning.
- Can design and defend a CRUD-plus-integration workflow in 25 minutes.
- Can implement or review a typed React/API slice without hand-waving errors or authorization.
- Can describe AI use as an engineering process, not a tool list.
- Have confirmed interview stages, dates, format, and evaluation focus.