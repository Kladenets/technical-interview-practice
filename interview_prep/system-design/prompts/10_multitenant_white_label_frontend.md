# Multi-Tenant White-Label Frontend

**Level:** senior
**Time:** 40m
**Context:** mongoose

Design the frontend architecture for a white-label insurance experience product delivered from a shared codebase to web and mobile. Tenants need distinct brands, enabled features, and backend capabilities without turning every customer into a separate application.

## Cover
- Establish target clients, accessibility, offline expectations, tenant isolation, release constraints, and performance budgets
- Describe application startup and rendering flow for tenant identity, design tokens, feature and capability configuration, and shared components
- Deep-dive theming and component-variant contracts that keep the component library shared when tenants need controlled differences
- Explain code-splitting, asset delivery, and bundle-size controls as the tenant and feature count grows
- Define configuration-aware release, rollback, observability, and degraded behaviour when tenant metadata or a capability is unavailable

## Stretch
- Propose a bounded extension mechanism for genuinely custom tenant behaviour without forking the application
- Explain how you would prove a new shared release remains compatible with tenants on different configuration versions
