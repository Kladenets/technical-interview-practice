# System Design
Practise turning an ambiguous product need into a defensible technical design. Senior and staff interviews test whether you can make scope, risk, and operational consequences explicit.

## Rubric dimensions
### requirements_and_scope
Measures whether functional, non-functional, and boundary requirements are established before design.
**2 (solid):** Clarifies users, core operations, scale, latency, durability, consistency, and excluded scope.
**3 (staff):** Defines durable boundaries and decision principles that let adjacent teams evolve independently.
### high_level_design
Measures whether the architecture and end-to-end request flows fit the requirements.
**2 (solid):** Presents coherent components and explains at least one complete read and write path.
**3 (staff):** Separates ownership boundaries and designs an extensible platform rather than a one-off diagram.
### technical_depth
Measures depth on the hardest component, data model, or correctness problem.
**2 (solid):** Deep-dives one or two hard components with schemas, algorithms, APIs, or consistency mechanics.
**3 (staff):** Anticipates evolution of the hard component and makes its invariants reusable across consumers.
### tradeoff_reasoning
Measures whether choices are tied to requirements, costs, and rejected alternatives.
**2 (solid):** States alternatives, selects one against explicit requirements, and names its downside.
**3 (staff):** Establishes reusable decision rules while accounting for organisational and migration tradeoffs.
### scale_and_failure
Measures quantitative sizing, bottlenecks, resilience, and degraded behaviour.
**2 (solid):** Uses plausible estimates, identifies bottlenecks and failure modes, and gives mitigation or degradation paths.
**3 (staff):** Connects growth assumptions to capacity, cost, and multi-team reliability responsibilities.
### operational_maturity
Measures how the design is rolled out, observed, recovered, and owned in production.
**2 (solid):** Defines SLOs, monitoring, safe rollout or rollback, and operational ownership.
**3 (staff):** Plans migration, long-term ownership, and cost controls across teams and system generations.

## Hard gates
- Choosing technologies before establishing requirements caps overall at 1.0.
- A design that cannot explain one end-to-end read and write path caps overall at 1.5.

## Common failure modes
- Component shopping-list with no request flow or data movement.
- “It scales horizontally” with no numbers, bottleneck, or partitioning story.
- Happy-path design with no failure, retry, or degraded-mode behaviour.
- Eventual consistency justified as faster rather than by a stated freshness requirement.
- Defending the original design after a new constraint instead of naming the broken assumption.
- Treating a diagram as a rollout, observability, and ownership plan.

## Strong vs weak
- **Strong:** "Before choosing storage I need peak write QPS, read/write ratio, retention, consistency requirements."
  **Weak:** "Use Kafka, Redis and Cassandra."
- **Strong:** "We choose eventual consistency for feed reads because 5s staleness is acceptable; the cost is stale content during replication lag."
  **Weak:** "Eventual consistency is faster."
- **Strong:** "A write is acknowledged after the primary commits; the outbox publishes asynchronously and clients can poll status."
  **Weak:** "The queue handles writes."
- **Strong:** "At 20k writes per second this partition key hotspots large tenants, so I would shard by tenant and time bucket."
  **Weak:** "We can add more database nodes."
