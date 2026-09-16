# Internal Analytics Platform

**Level:** senior
**Time:** 45m
**Context:** link-logistics

Design an internal analytics platform for a data-intensive business (think industrial real estate: markets, assets, tenants, leases, transactions). Product managers, data scientists, and business analysts depend on it for decisions. It must surface SQL-derived metrics and machine-learning outputs through responsive applications, and the numbers must be trustworthy enough that people act on them.

## Cover
- Establish users, core queries, freshness, latency, access scope, and excluded scope before choosing a design
- Describe the components and one full read path from a large data source through an API to a rendered insight
- Deep-dive the contract between the application layer and the data/ML layer: how model and pipeline outputs become the app's responsibility, with provenance and confidence
- Explain caching versus live reads for slow analytical queries, tied to a stated freshness requirement, and the degraded behaviour when a source is stale
- Define how a stale or wrong number is detected, surfaced, and treated as a production incident, including observability and ownership

## Stretch
- Describe how a new dataset or metric is onboarded with a clear owner, update cadence, and quality SLA
- Explain when a derived number should be withheld or flagged rather than shown, and how the UI communicates that
