# Compliance Data Boundary

**Level:** senior
**Time:** 40m
**Context:** mongoose

Design an AI-assisted experience over sensitive regulated records with a hard guarantee: sensitive data is retained only inside a defined boundary and is never sent to a third-party model. The assistant must still give users useful, grounded help.

## Cover
- Establish the data classifications, trust boundaries, permitted users, threat model, retention rules, and the exact guarantee to be made
- Explain the end-to-end request flow, including which references, tokens, or de-identified projections cross the boundary and how results return
- Deep-dive where de-identification occurs, how it is verified, and what happens when it is incomplete or uncertain
- Identify logs, traces, error reporting, analytics, and audit records as leak paths; define what each may and may not store
- Describe evidence, controls, monitoring, and incident response that would let a customer architecture reviewer verify the claim

## Stretch
- Analyse failure modes that could break the boundary, including vendor SDK changes and debugging shortcuts, and how each is detected or prevented
- State the residual risk and product limitations you would accept rather than weaken the guarantee
