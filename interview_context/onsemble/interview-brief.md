# Onsemble Interview Brief

## Working thesis

Onsemble is a small, autonomous digital innovation team inside Hajoca. The role is likely to reward a product-minded full-stack engineer who can turn ambiguous customer and distribution-center feedback into dependable, self-service workflows, while using AI tools with strong engineering judgment.

## Role evidence

### Confirmed by Nancy

- Team of 6; currently 2 engineers; hiring a full-stack engineer and an engineering manager.
- Fully remote; customer conversations are part of the work.
- Onsemble began as a climate-tech startup and was acquired by Hajoca.
- The team continues building workflow tools for plumbers and is expanding support for Hajoca customers.
- The product moved from contractor pilot work toward distribution-center adoption and scale.
- The near-term goal is more self-service product behavior before expanding into new products.
- AI-native development is embedded in the team's internal process and external product work.
- Stack: React, TanStack Query, Vite, TypeScript; Node.js, Express.js, TypeScript; PostgreSQL via Supabase; Drizzle ORM; Supabase, Heroku, AWS/Lambda; Clerk.

### Confirmed by public sources

- Onsemble describes itself as an AI platform for plumbing and home-services professionals, focused on simplifying workflows and improving margins.
- Hajoca describes Onsemble as its digital innovation team, with startup autonomy and the reach and stability of a large distributor.
- The current Hajoca Full-Stack Engineer listing says the role owns product features from discovery through launch and iteration, ships production code daily, and contributes to frontend and backend architecture.
- The full-stack listing emphasizes AI-assisted development, Claude Code, backend APIs, data models, integrations, architecture tradeoffs, production reliability, ambiguity, prioritization, and concise communication.
- The public listing names Claude-based integrations and internal tooling, plus GPT-5 for search.
- Public team information shows product, operations, partnerships, ML/data science, and backend perspectives around the product.

### Full-Stack Engineer posting details

- Requisition: 9950; posted August 10, 2026; listed compensation: $150,000–$160,000.
- Minimum experience: 4+ years of professional software engineering experience and a relevant degree or equivalent experience.
- The role is explicitly an individual-contributor role, not an engineering-management role.
- Core responsibilities: own features end to end, partner with Product, ship daily, improve tooling and workflows, surface risks early, and maintain quality, reliability, and long-term maintainability.
- The candidate profile repeatedly emphasizes ownership of outcomes, strong technical judgment, clear written and oral communication, organization, prioritization, and calm execution in ambiguity.

## Sources

- https://onsemble.com/about
- https://onsemble.com/old-home
- https://jobs.dayforcehcm.com/en-US/hajoca/candidateportal/jobs/31392
- https://jobs.dayforcehcm.com/hajoca/candidateportal/jobs/31376
- https://kylekent.dev
- https://kylekent.dev/resume

## Interview process

Stages, format, and tool policy are **not yet confirmed** — resolving them is the
top priority of the next conversation with Nancy (see Unknowns). Update this
table once known.

| Stage | With | Focus | Prep category |
|---|---|---|---|
| Recruiter/hiring | Nancy | Fit, motivation, process framing | `self-assessment`, `product-collaboration` |
| TBD technical | TBD | Likely coding and/or system design — format unconfirmed | `system-design`, role-shaped coding |
| TBD product/behavioral | TBD | Ownership, ambiguity, customer judgment, AI-native practice | `product-collaboration`, `agentic-development` |

## Interview signal map

| Likely signal | Your strongest evidence | Preparation gap to close |
|---|---|---|
| React and TypeScript delivery | IKEA microfrontends, SSR/CSR, design systems, TypeScript upgrades; portfolio | Practice explaining a small React + TanStack Query feature end to end |
| Backend/API ownership | REST, GraphQL, Django, SQL, PostgreSQL, API hooks, SQL optimization | Refresh Node/Express service design, validation, errors, auth, and tests |
| Data modeling and integrations | SQL stored procedures, PostgreSQL, Cloudflare/GCP integrations, observability | Practice a Postgres schema and integration tradeoff for a contractor workflow |
| Production reliability | Tier 1 services, on-call, edge caching, SSR state leakage, MTTR improvements | Prepare concise incident and operational-excellence stories |
| Customer and product judgment | Product-owner partnership, feasibility, experiments, measurable fixes | Rehearse discovery through iteration and prioritizing conflicting plumber/distribution-center feedback |
| AI-native development | MCP servers, OpenCode/OpenChamber, multi-agent tooling on resume | Be concrete about verification, security, tests, and when not to delegate to AI |
| Ownership in a small team | Led architecture, migrations, CI/CD, observability, cross-repo modernization | Frame end-to-end feature ownership, technical judgment, and outcomes without relying on team scale |
| Motivation and fit | Real-user systems, full-stack breadth, remote autonomy, mentorship | Build a specific Onsemble/Hajoca narrative, not a generic startup answer |

## Strengths to lean on

- **React and TypeScript at platform scale** — IKEA microfrontends, SSR/CSR,
  design systems, and TypeScript upgrades map directly onto the React/TanStack
  Query/Vite frontend. Frame end-to-end feature ownership, not team scale.
- **Production reliability ownership** — Tier 1 services, on-call, edge caching,
  SSR state-leakage fixes, and MTTR improvements are concrete evidence for the
  "correctness, reliability, maintainability" bar the posting repeats.
- **AI-native development** — MCP servers and OpenCode/OpenChamber multi-agent
  tooling are directly relevant to a team where agentic coding is embedded.
  Lead with verification, tests, security, and when *not* to delegate.

## Known gaps

- **Node/Express + Postgres/Drizzle + Clerk + TanStack Query** are the stack
  pieces the catalog does not yet exercise. Close with focused design drills and
  the generation targets in the crash course; do not hand-wave the API/auth/data
  layer.
- **Interview format is unconfirmed.** Prepare for both a live coding round and a
  system-design conversation until stages are known.

## Questions to ask Nancy

- What are the first two outcomes you need this hire to own in the first 90 days?
- Which workflows are currently used by contractors versus distribution centers, and where do they diverge?
- What does "self-service" mean in the product today: configuration, onboarding, support, data setup, or all of these?
- Where are the biggest current constraints: product discovery, engineering throughput, data quality, integrations, or adoption?
- How do you decide whether feedback is a local request or a reusable product capability?
- What does AI-native development look like in code review, testing, deployment, and production support?
- What are the boundaries between Onsemble and Hajoca teams, systems, security, and operating processes?
- What would make you say after six months that this hire was an excellent decision?

## Unknowns to resolve in the next conversation

- Exact interview stages and whether there will be live coding, a take-home, or a system-design exercise.
- How much hands-on backend work the full-stack role owns versus frontend or customer discovery.
- Current product architecture, tenancy model, deployment topology, and integration boundaries.
- AI feature evaluation, privacy, prompt/data handling, and failure modes.
- Compensation, reporting line, travel/customer-visit expectations, and timing.