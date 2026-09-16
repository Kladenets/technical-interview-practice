# Crash Course — Link Logistics

Ordered by **interview signal per hour**. The interview format is unconfirmed, so
this plan keeps a coding surface and a conversational surface warm until the
referral clarifies the loop.

## Window

- Interview date: TBD — confirm via referral before committing dates
- Hours available: ~10/week baseline; compress to 6–8 if the loop lands inside a week
- Rest day: Sunday

## Priorities

1. **Resolve the loop.** Use the referral to learn stages, coding-round presence,
   in-office reality, and team shape. Everything below is provisional until then.
2. **Full-stack analytics delivery.** A React/TypeScript UI over a Python/SQL API
   that surfaces analytics/ML output with trust (loading, staleness, provenance).
3. **Player-coach and stakeholder communication.** Reviewing contractor/intern
   code and translating business-analyst needs into scoped features.
4. **AI-assisted engineering judgment.** Already a strength — polish verification
   and rollback framing.
5. **Cloud/data ramp story.** A credible Azure/Databricks position without
   overclaiming.

## Outcomes

- Tell a precise story about why Link and why this role, grounded in real tradeoffs.
- Build and narrate a data-dense analytics feature end to end with trust semantics.
- Explain how you review less-senior contributors' code and set standards.
- Give a concrete AI-assisted change with verification, review, and rollback.
- Have a credible ramp plan for Azure, Databricks/Spark, and ML-output integration.

## How this repository fits

The catalog is strongest for React dashboards and standalone domain logic. Use
these as deliberate warmups and replays:

| Interview signal | Existing problem to tackle | What to practice saying |
|---|---|---|
| Live dashboard, streams, filtering | `react/practice_problems/problem_05_campaign_dashboard.tsx` | Derived state, typed props, live updates, and how the UI communicates freshness/failure |
| Sorting/filtering/inline editing over tabular data | `react/practice_problems/problem_04_contract_dashboard.jsx` | Controlled inputs, mutation boundaries, and accessible feedback on data-dense tables |
| Polling, cancellation, live status | `react/practice_problems/problem_08_claims_tracker.tsx` | Effect cleanup, abort behavior, stale responses, and when polling should become push |
| Aggregation / analytics domain logic | `typescript/practice_problems/problem_01_donation_processor.ts` | Data modeling, aggregation correctness, and time-series stats over a dataset |
| Event ingestion, dedup, provenance | `python/practice_problems/problem_18_integration_event_processor.py` | Idempotency, ordering, and treating stale/bad data as a production incident |
| Lifecycle modeling and auditability | `python/practice_problems/problem_08_enrollment_pipeline.py` | Explicit transitions, invalid states, metrics, and durable history |

These are preparation surfaces, not simulations of the Link stack. The catalog
has **no analytics-over-data-pipeline problem** (Python API surfacing ML/SQL
output with provenance and interactive visualization), so that needs a new
exercise — see below.

## Problems to generate

Keep each generic (no Link/Blackstone/warehouse names) and follow the normal stub,
tests, answer path, and `data.js` conventions. Generate only after replaying the
existing problems above.

### Priority 1: analytics insight API (Python or TypeScript)

- Part 1: ingest a dataset and compute deterministic aggregates/metrics.
- Part 2: attach provenance — source, freshness/as-of timestamp, and a confidence
  or completeness flag; mark stale or low-confidence results explicitly.
- Part 3: expose a query API with filters (market, time bucket, tenant/scope) and
  safe degraded behavior when a source is stale or missing.
- Signals: data modeling, aggregation correctness, data-trust semantics, API
  contracts, and knowing when a number should not be shown.

### Priority 2: analytics dashboard (React/TypeScript)

- Part 1: render metrics + an interactive chart with loading, empty, and error states.
- Part 2: filtering, drill-down, and a "data as of / freshness" indicator that
  reflects staleness from the API.
- Part 3: optimistic annotation/note submission with rollback, and access-scoped views.
- Signals: React composition, typed props, data-viz reasoning, and communicating
  trust/freshness in the UI.

### System-design companion

Practice explaining the same slice as a React/TS client, a Python API layer, a
SQL/Databricks data source, and an ML-output boundary — covering contracts
between the app team and data teams, caching vs. live reads tied to a freshness
requirement, provenance/lineage, and Azure deployment.

## Conversational prep (`interview_prep/`)

Non-testable stages — system design, product collaboration, leadership, AI
tooling, behavioral, fit. Link-specific prompts are tagged `Context: link-logistics`;
generic prompts serve every role and stay untagged. Drill the tagged ones first.

| Interview signal | Prompt | Status |
|---|---|---|
| Analytics platform over a data layer | `system-design/15_internal_analytics_platform` | link-logistics |
| Data trust / provenance as a product requirement | `product-collaboration/08_data_trust_stakeholders` | link-logistics |
| Player-coach: raising the bar without authority | `leadership-and-influence/07_player_coach_without_authority` | link-logistics |
| Fit: senior IC in a large digitally-native firm | `self-assessment/10_why_this_environment_enterprise` | link-logistics |
| AI-native workflow, verification, when not to delegate | `agentic-development/01_end_to_end_workflow`, `04_reviewing_generated_code`, `03_not_to_delegate` | generic |
| Ownership, failure, incident stories | `experience-stories/01_hardest_technical_problem`, `04_project_slipped_or_failed` | generic |
| Mentoring a specific gap | `leadership-and-influence/02_mentoring_specific_gap` | generic |
| Generic system-design range | `system-design/04_ci_analytics_pipeline`, `02_health_records_search` | generic |

Answer the four tagged prompts, get them judged, replay the lowest two. See
`interview_prep/AGENTS.md` for the judging contract.

## Practice schedule (provisional — confirm loop first)

### Week 1 — establish fit and full-stack fluency

- **Mon:** Role narrative + three "Why Link?" angles (product, technical, data-trust); one medium coding problem timed.
- **Tue:** Replay `problem_05_campaign_dashboard.tsx`; adapt on paper into the Priority 2 analytics dashboard.
- **Wed:** Design the Priority 1 analytics insight API; specify validation, provenance, and contracts.
- **Thu:** SQL/data drill; connect stored-procedure/optimization experience to a Databricks/Spark narrative; ramp story for Azure.
- **Fri:** Behavioral — player-coach, ambiguity, incident stories reframed as data-trust incidents; answer the `leadership-and-influence` tagged prompt.
- **Sat:** Mock + replay; write what was weak and the questions for the referral.

### Week 2 — simulate the loop and sharpen gaps

- **Mon:** Two replayed medium problems from different patterns.
- **Tue:** Full system design of the analytics platform end to end with follow-up pressure.
- **Wed:** Stakeholder role-play — translate a business-analyst request into a scoped analytics feature; answer `product-collaboration/08`.
- **Thu:** AI-assisted quality drill: a generated change you would reject or constrain; verification and rollback.
- **Fri:** Full behavioral + motivation rehearsal, including in-office/relocation questions.
- **Sat:** Final simulation; one-page interview-day sheet.

## Priority order if time collapses to one week

1. Confirm the loop via referral; role narrative + five stories.
2. Full-stack analytics feature (API + dashboard) reasoning.
3. System design of an internal analytics platform with data-trust semantics.
4. Player-coach and stakeholder-communication stories.
5. Azure/Databricks ramp story + AI-assisted verification judgment.

## Completion checks

- Can explain why Link and why this role in under 90 seconds, grounded in tradeoffs.
- Can design and defend an analytics API + dashboard slice in 25 minutes, including provenance and freshness.
- Can describe reviewing a contractor/intern's code and setting a standard.
- Can give a credible Azure/Databricks ramp story without overclaiming.
- Have confirmed interview stages, format, in-office reality, and timeline.

## Do not

- Overclaim Azure, Databricks/Spark, or the ML stack — position them as ramp.
- Grind algorithms at the expense of the analytics full-stack slice.
- Lead with a raw years-of-experience count; lead with scope and ownership.
