# Ledger Migration Under Load

**Level:** staff
**Time:** 55m

An existing fintech ledger stores balances in a single database and is approaching its write limit. Redesign it while transactions continue and historical auditability must not be weakened.

## Cover
- Establish invariants, regulatory constraints, load profile, and non-negotiable scope
- Describe old and new write, read, reconciliation, and audit paths
- Deep-dive dual-write, backfill, or cutover correctness and failure recovery
- Address capacity, SLOs, rollback, ownership, and migration cost

## Stretch
- Define principles other product teams can use when integrating with the ledger
- Explain when you would stop or reverse the migration
