# Config-Driven Experience Engine

**Level:** senior
**Time:** 45m
**Context:** mongoose

Design a platform where non-engineers configure pages, reusable features, content, branding, and business rules for many tenants, and those configurations render as real web and mobile applications. Decide what is safely configurable and where a product change must still be implemented in code.

## Cover
- Establish users, tenant isolation, availability, render-latency, authoring, and excluded-scope requirements before choosing a design
- Describe the configuration schema, versioning model, and the read path from a tenant application to a rendered experience
- Explain validation, preview, approval, publish, rollout, and rollback flows that prevent a bad configuration from reaching production
- Deep-dive the boundary between declarative configuration and code, including the cost of supporting a new configurable capability
- Address cache invalidation, observability, safe release ownership, and failure behaviour when configuration cannot be loaded

## Stretch
- Design a migration path when a live schema changes while tenants remain on old configurations
- Explain how you would retire an old feature or configuration field without coupling every tenant to one release date
