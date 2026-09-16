# Self-Service Field-Service Workflow

**Level:** senior
**Time:** 45m
**Context:** onsemble

Design a self-service workflow platform for a field-service business (think plumbing and trades) that runs inside a large multi-branch distributor. Small independent operators and internal branch staff both use it, and the goal is to let customers configure and complete workflows themselves rather than routing every change through support. Decide what becomes self-service and what still needs a human.

## Cover
- Establish the two user classes, tenant/branch isolation, availability, latency, onboarding, and excluded-scope requirements before choosing a design
- Describe the components and the end-to-end read and write path for a customer completing a work-order workflow without support involvement
- Deep-dive the data model for work orders, workflow state, and per-tenant configuration, and the invariants that keep self-service edits safe
- Compare where the system decides automatically versus where it must surface a human confirmation, and justify each against a stated requirement
- Define rollout, observability, safe rollback, and operational ownership when a self-service change misbehaves in production

## Stretch
- Explain how a workflow proven for one customer becomes a reusable product capability instead of a per-customer fork
- Describe the migration path when the workflow schema changes while tenants are mid-workflow
