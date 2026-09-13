# Guardrails for Agent Actions

**Level:** senior
**Time:** 25m
**Context:** mongoose

An AI feature is preparing to take a real action on a user's behalf in an insurance experience platform. Describe the product and engineering guardrails you require before release, treating model output, retrieved content, and user-supplied text as untrusted inputs rather than authority.

## Cover
- Describe a concrete release and review workflow that verifies the action path, authorisation checks, and guardrails with adversarial cases
- Separate what the model may propose from what deterministic systems decide, including identity, permissions, policy, and exact action arguments
- Define when human confirmation is required and how blast radius, reversibility, and action risk change the decision
- Identify prompt injection and untrusted retrieved text as failure sources, then name safeguards and the evidence that they work
- State the limits where you would refuse autonomous action and require a deterministic workflow or human owner instead

## Stretch
- An agent takes a wrong action in production: explain the audit, rollback or compensation, kill switch, and incident practice you built beforehand to make recovery possible
