# Async Integration Reliability

**Level:** senior
**Time:** 40m
**Context:** onsemble

Design the asynchronous integration boundary for a field-service platform that ingests events from external systems (supplier catalogs, pricing, order status) over webhooks and serverless functions, and must keep the product's own data consistent despite retries, out-of-order delivery, and downstream outages.

## Cover
- Clarify delivery guarantees, ordering needs, freshness, tenant isolation, and what the boundary deliberately does not promise before designing
- Describe the ingest path: webhook receipt, validation, idempotent processing, and how a change reaches the product's data model
- Deep-dive deduplication, idempotency keys, ordering, and the state model for an event that fails partway through
- Explain retry scheduling, dead-letter handling, backpressure, and degraded behaviour when a downstream system is slow or down
- Define observability, alerting, replay, and operational ownership so a stuck integration is detected and recoverable

## Stretch
- Describe how you would reprocess a day of dead-lettered events safely after fixing a bug, without double-applying effects
- Explain when you would move a synchronous read behind a cache versus keeping a live lookup, tied to a freshness requirement
