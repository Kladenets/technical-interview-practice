# Integration Normalisation Layer

**Level:** senior
**Time:** 40m
**Context:** mongoose

Design an integration layer for an insurance experience platform that connects to customer systems over REST, GraphQL, FHIR, HL7, and slow legacy interfaces, but exposes one internal model to product features. A feature should work across customers without the product being forked for each backend.

## Cover
- Clarify supported operations, freshness, correctness, tenant isolation, latency targets, and what the normalised model deliberately excludes
- Explain the feature read and write paths through a normalised API, tenant adapter, and external customer system
- Deep-dive how adapters express per-customer mappings and partial capabilities without leaking protocol details into product features
- Compare caching and synchronous reads for slow systems, and describe timeout, retry, reconciliation, and degraded behaviour
- Define contract, fixture, and end-to-end testing for adapters, including ownership and onboarding signals

## Stretch
- Describe how a new customer system could be onboarded through configuration or a constrained adapter contract rather than a product-code change
- State when normalisation becomes lossy enough that you would expose a capability-specific extension instead
