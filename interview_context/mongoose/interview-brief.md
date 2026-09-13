# Interview Brief — Mongoose (slug: `mongoose`)

## Working thesis

This role rewards a **product-minded senior full-stack generalist who ships**.
Not a specialist. The signals, in order: can you take an ambiguous product brief
and drive it to production without a lead; can you reason about frontend
architecture at platform scale; can you work fluently with AI tooling *and* with
non-deterministic AI features as product surface; can you operate as engineer
~#8 in a startup with real enterprise customers in a regulated domain.

There is **no live coding and no take-home**. Every stage is a conversation.
That makes articulation the entire game — the same work described vaguely
scores as mid-level and described specifically scores as senior.

## Role evidence

- **Company and product context:** "The AI Experience Layer for Payers" —
  health insurance. Sells to payers (B2B) whose members, brokers, employers and
  providers are the end users (B2B2C). Positioned as a portal replacement and
  modernisation layer above existing core systems.
- **Team and collaboration context:** ~7–8 engineers, hiring 2 to reach 9–10 by
  year end. Everyone owns features end to end. Agile, multiple PMs each owning
  an area. Long-term roadmap but reactive to customer needs. Explicitly want
  someone who *drives initiatives after handoff from product*.
- **Stack and architecture:** Frontend-heavy with some backend. Flutter/Dart
  mobile component. Integration-agnostic layer over REST, GraphQL, FHIR, HL7.
  Composable "Atomic Features" reused across portals, brands and markets. One
  build targeting native web and mobile. White-label per tenant. A config tool
  ("Composer") lets business teams change content, branding, features, benefits
  and commissions without engineering.
- **The two architectural ideas that define the product:**
  - **Governed Execution** — every agent action is *previewed, confirmed,
    executed and receipted*, with a full audit trail, "built to pass
    architecture review". Human-in-the-loop by design.
  - **PHI-Free Architecture** — a zero-retention boundary; agents are claimed to
    operate "without ever touching member data". Compliance as an architectural
    constraint, used commercially to skip BAA negotiation and compliance review.
- **Agent surface:** Front Door Agents (member/broker/employer/provider
  self-service), Service Center Agents (CSR and sales workflows — agent prepares
  work across systems, human confirms in one click), and Operations agents
  across enrollment, claims, prior authorisation, pharmacy, credentialing.
  Explicitly "not generic chatbots" — they take action.
- **Tooling:** Claude and Cursor are in daily use and AI tool fluency is an
  explicit interview topic.
- **Comp and logistics:** $180–200k. Remote, Eastern hours, team clustered in
  NJ/NY/New England, quarterly in-person in NY/CT. Health insurance noted as
  more expensive at this size; founders have run a startup together before and
  carried parental leave from it.

## Interview process

| Stage | With | Focus | Prep category |
|---|---|---|---|
| 1–2 | Engineers | Live sessions on how you build software | `product-collaboration`, `engineering-philosophy` |
| 3 | CTO | Big picture, architecture | `system-design` |
| — | (CEO has asked a short design question before, to check hands-on chops) | | `system-design` (20m format) |
| 4–5 | CEO and Chief Product Officer | Working with product, culture fit | `product-collaboration`, `self-assessment` |

Roughly two weeks end to end.

## Interview signal map

| Likely signal | Evidence | Preparation gap |
|---|---|---|
| Drives ambiguous work after PM handoff | Stated in the call; two stages with CEO/CPO | Highest-value gap — new `product-collaboration` category |
| Ships end to end, owns features | "everyone owns features end to end" | Narrating a full build; startup-fit framing |
| Frontend architecture at platform scale | Atomic Features, white-label, one build → web + mobile | System-design prompts are backend-shaped; need frontend/config-driven ones |
| Reasons about agents as a product surface | Governed Execution is the core product | No hands-on agent experience — build something small yourself |
| Compliance as a design constraint | PHI-Free Architecture | Practise designing *around* a data boundary |
| Integration breadth | REST/GraphQL/FHIR/HL7 | Practise an adapter/normalisation layer design |
| AI tooling fluency | Claude/Cursor; explicit topic | Already strong — `agentic-development` |
| Startup-stage fit | 9–10 people, quarterly in person | "Why this stage" is not yet covered |

## Strengths to lean on

MCP server experience is directly relevant — MCP *is* a tool-calling protocol,
and their whole product is tool-calling agents with a governance layer. Frame it
as "I have built the tool side of the agent-computer interface", then close the
gap on the agent loop itself.

## Known gaps

- No production experience building LLM agents or AI features. Close this with
  a small agent you build yourself. Do not overclaim — "I built a small
  tool-calling agent with a human approval step to
  understand the problem shape" is credible and lands well; implying production
  experience does not.
- Flutter/Dart, if unfamiliar. Likely acceptable given a frontend-heavy React
  focus, but have a position on how you would ramp.

## Questions to ask them

- How does the PHI-free boundary hold up in practice — what does the model
  actually see, and where does the de-identification happen?
- What does an agent action's audit record contain, and who consumes it?
- How do you test agent behaviour? Is there an eval suite, and what happens when
  a model version changes underneath you?
- Where is the line between what Composer configures and what needs an engineer?
- How much of the mobile work is shared with web, and who owns Flutter?
- What does the handoff from a PM actually look like — brief, spec, or a
  conversation?
- Who is on call, and what does an incident look like for an agent that took a
  wrong action?

## Unknowns to resolve

- Funding stage and runway.
- Frontend framework specifics (React assumed, unconfirmed) and whether the web
  and Flutter builds genuinely share a codebase.
- Which model providers, and whether they are pinned.
- Team split between platform work and customer-specific delivery.
