# Interview Brief — Link Logistics (slug: `link-logistics`)

## Working thesis

This role rewards a **senior full-stack engineer who can turn analytics and ML
outputs into trustworthy internal products, and who can raise the bar for a mixed
team of contractors and interns without formal authority.** The order of signals:
can you ship a React/TypeScript + Python analytics application end to end; can you
integrate data-pipeline and ML outputs so business stakeholders actually trust
the numbers; can you operate as a "player-coach" — writing the hard code yourself
while reviewing and coordinating less-senior contributors; and can you do all of
this in a fast, ambiguous environment using AI-assisted tooling with judgment.

The format is **unknown** — no intro call yet. Prepare for a conventional
enterprise loop (recruiter screen → technical/coding → system design → team/behavioral)
until confirmed. The role is **in-office** across five hub cities, which is a
material logistics decision to resolve early.

## Role evidence

### Confirmed by the posting (JR101850)

- **Company/product:** Digitally native industrial (last-mile logistics) real
  estate firm, Blackstone-founded 2019, ~500M sq ft. Tech org grew 9 → 115+ and
  runs the Link Data Platform (25B+ data elements) plus custom apps (Property IQ,
  Clause IQ, Link+). This role builds an **internal analytics platform**.
- **Team/collaboration:** Works with product managers, data scientists, and
  business leaders. Explicit **player-coach** mandate: write significant code and
  lead contractors and interns via guidance and code review.
- **Stack:** React/TypeScript front end; Python (preferred) or Node back end;
  SQL + Databricks/Spark; Streamlit for prototypes; **Azure** preferred, CI/CD,
  Docker/Kubernetes; TensorFlow/Scikit-learn/MLOps; D3.js/Plotly viz; Cursor and
  other AI-assisted tools.
- **Responsibilities:** End-to-end apps that surface analytics/ML insights;
  scalable APIs; integrate data pipelines, ML models, and visualization;
  performant/secure/scalable on cloud; architectural decisions and best-practice
  advocacy; stakeholder communication.
- **Bar/logistics:** 10+ years full-stack; $185k–$245k base; full-time in-office
  (NYC / Atlanta / Dallas / Fort Washington PA / Chicago).

### Confirmed by public sources

- CTO Clark Ardern frames Technology as a strategic partner; heavy emphasis on
  business/tech "shared fluency", cross-functional collaboration, and regular
  in-person time even for distributed staff.
- ML/predictive analytics already drive rent and asset valuation; "data trust /
  provenance" is a stated first-class concern across adjacent roles (a bad comp
  or stale signal is treated as a production incident).

### Referral path

- Candidate has a personal contact employed at Link who can refer. Use this to
  resolve the Unknowns below **before** a formal recruiter call, and to learn the
  real interview loop and team shape.

## Sources

- https://www.linklogistics.com/about/careers/job-openings/engineer-software-jr101850/
- https://www.linklogistics.com/news-insights/industry-expertise/qa-chief-technology-officer-clark-ardern-building-digitally-native-industrial-real-estate-company/
- https://www.linklogistics.com/news-insights/industry-expertise/new-playbook-digital-innovation-industrial-real-estate/
- https://theorg.com/org/link-logistics/teams/technology-and-engineering
- https://kylekent.dev
- https://kylekent.dev/resume

## Interview process

Stages and format are **not yet confirmed** — resolving them via the referral or
recruiter is the top priority. This is the expected shape for an enterprise
full-stack role; update once known.

| Stage | With | Focus | Prep category |
|---|---|---|---|
| Referral / recruiter screen | Contact + recruiter | Fit, motivation, logistics, loop shape | `self-assessment` |
| Technical / coding | Engineer(s) | Full-stack coding — likely React + Python/API | role-shaped coding |
| System design | Senior engineer / architect | Internal analytics platform over a data layer | `system-design` |
| Team / behavioral | Hiring manager + peers | Player-coach, stakeholder communication, ambiguity | `product-collaboration`, `leadership-and-influence` |

## Interview signal map

| Likely signal | Candidate's strongest evidence | Preparation gap to close |
|---|---|---|
| React + TypeScript delivery | IKEA microfrontends, SSR/CSR, edge, design-system/TS upgrades, portfolio | Reframe from e-commerce to a data-dense **analytics UI**; add interactive charts |
| Backend/API in Python or Node | Python/Django HIPAA NLP app; Node tooling; REST/GraphQL | Refresh a Python analytics API: contracts, validation, low-latency reads over SQL |
| Integrating ML / analytics outputs | Dialogflow/NLP app; SQL data work | Practice consuming data-science outputs with **provenance, freshness, confidence** |
| Data / SQL at scale | SQL stored procedures, query-latency optimization, Postgres | Connect SQL work to a **Databricks/Spark** analytics narrative |
| Player-coach / mentoring | Founded DevOps Guild, standardized workflows, code review, mentorship | Frame **reviewing contractor/intern code** and setting standards without authority |
| Production reliability | Tier 1 on-call, edge caching, SSR state-leak fix, Vaka/MTTR | Prepare incident stories reframed as **analyst-trust / bad-data** incidents |
| AI-assisted development | Copilot, MCP servers, agentic tooling, Jira→Copilot automation | Be concrete about verification, review, and rollback for generated code |
| Ambiguity + stakeholder comms | Client delivery at BrickSimple/Proconex; product-owner partnership | Rehearse translating business-analyst needs into a scoped analytics feature |

## Strengths to lean on

- **React/TypeScript at platform scale** is a direct hit: 11 repos, 144
  country-locale deployments, SSR/edge, microfrontends, a 52→1 deployment
  consolidation. Reframe the same depth onto a data-dense internal analytics app.
- **Genuine full-stack + SQL**: Python/Django delivery plus SQL stored-procedure
  optimization and data-integrity work map onto "Python API over SQL/analytics."
- **Player-coach without the title**: founding and leading a company-wide DevOps
  Guild, standardizing GCP/Terraform/GitHub Actions, and mentoring is the closest
  evidence to "lead contractors and interns." Lead with it.
- **AI-assisted engineering with judgment**: MCP servers and agentic workflows are
  ahead of the "familiarity with AI-assisted tools" bar — frame verification and
  ownership, not novelty.
- **Observability/reliability**: Vaka and MTTR work support "treat a stale signal
  as a production incident," which is this org's stated data-trust value.

## Known gaps

- **Azure.** Candidate is GCP/Cloudflare/Fastly. The concepts transfer; have a
  ramp position ("cloud-agnostic fundamentals; here's how I'd port my GCP/edge
  experience to Azure + Databricks") rather than overclaiming Azure depth.
- **Databricks/Spark and the ML stack (TensorFlow/Scikit-learn/MLOps).** No direct
  evidence. Position as *consuming and integrating* data-science outputs (which is
  the role) rather than *authoring* models; learn the vocabulary of pipelines,
  evals, and provenance.
- **Data visualization (D3.js/Plotly) and Streamlit.** Buildable quickly; do a
  small interactive-chart lab so it is concrete, not claimed.
- **Formal management of contractors/interns.** You have mentoring and guild
  leadership, not direct reports. Be honest and frame the transferable behaviors.
- **The "10+ years" bar.** SWE track is Aug 2016→present (~9–10 yrs). Have a
  crisp framing that leads with scope and ownership (Tier 1, platform, breadth)
  rather than a raw year count, and let the referral vouch for level.

## Questions to ask (use the referral first)

- What are the first two outcomes this hire owns in the first 90 days?
- What is the interview loop — stages, who, and is there a coding round or take-home?
- How real is the in-office expectation across the five cities, and which office
  is the team's center of gravity?
- What does the analytics platform surface today, and who are its internal users
  (investment, asset management, leasing, capital markets)?
- How large is the contractor/intern group this role coordinates, and what does
  "manage" mean day to day?
- How do the app team and data-science/data-engineering teams share contracts —
  where does model output become the app's responsibility?
- What is the Azure/Databricks footprint, and how much of it would I own vs. consume?
- How does the team use AI-assisted tooling in review, testing, and deployment today?

## Unknowns to resolve

- Interview stages, format, coding-round presence, and timeline.
- Real remote/hybrid flexibility vs. strict in-office, and preferred location.
- Team size/structure and the exact scope of the "coach" responsibility.
- Which analytics platform/product this maps to (Property IQ, an investment
  Analytics Engine, or a new internal tool) and its current maturity.
- Data/ML ownership boundary between this role and data engineering/science.
- Level calibration given the 10+ year line vs. the candidate's ~9–10 years.
