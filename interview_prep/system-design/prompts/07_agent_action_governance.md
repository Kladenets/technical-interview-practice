# Governed Agent Actions

**Level:** senior
**Time:** 45m
**Context:** mongoose

Design the system for a health-tech payer platform where an AI assistant can prepare a real backend action, a staff member previews and confirms it, and the platform executes it and produces a receipt. The model may be non-deterministic, but authority and correctness must come from the platform.

## Cover
- Establish the actors, action risk classes, latency and durability expectations, and what the agent is explicitly not allowed to authorise
- Explain the proposal, preview, confirmation, execution, receipt, and audit flows end to end
- Deep-dive the action proposal and approval contract: exact arguments, authoriser, idempotency key, data version, and duplicate-execution prevention
- Describe the conflict policy when underlying data changes after proposal, plus failure and partial-execution recovery
- Define the audit record, its permitted consumers, and the operational signals, retention, and incident workflow

## Stretch
- Make approvals durable across a process restart or multi-day wait without allowing a confirmation to be replayed against different arguments
- State which guarantees depend on each downstream system and how the product degrades when one cannot provide them
