# Leadership and Influence
Practise creating technical direction and organisational leverage without relying on formal authority. Promotion-facing interviews look for durable impact through people, mechanisms, and cross-team decisions.

## Rubric dimensions
### scope_of_influence
Measures the real blast radius of the work and relationships affected.
**2 (solid):** Influences a subsystem or team beyond assigned implementation work.
**3 (staff):** Aligns multiple teams or an organisational area around a sustained direction.
### technical_direction
Measures vision, principles, roadmap, and migration strategy.
**2 (solid):** Sets a clear technical direction with priorities, tradeoffs, and a credible next step.
**3 (staff):** Establishes a 12–18 month direction and principles that guide independent teams.
### influence_mechanism
Measures how alignment was achieved, not merely the outcome claimed.
**2 (solid):** Uses concrete mechanisms such as an RFC, prototype, data, or sequencing to resolve concerns.
**3 (staff):** Adapts mechanisms to competing incentives and addresses others' migration cost and constraints.
### talent_multiplication
Measures mentorship, sponsorship, and creation of capable successors.
**2 (solid):** Diagnoses a specific gap, intervenes deliberately, and shows an observed outcome.
**3 (staff):** Builds successors, sponsors growth, and scales capability through repeatable development practices.
### organizational_leverage
Measures mechanisms that outlast personal involvement.
**2 (solid):** Leaves useful tooling, documentation, standards, or process adopted by others.
**3 (staff):** Creates durable organisational systems that prevent recurrence across teams.
### stakeholder_communication
Measures translation and alignment with product, leadership, and non-technical partners.
**2 (solid):** Communicates technical risk and options in terms the audience can act on.
**3 (staff):** Shapes organisational decisions by connecting technical direction to strategy, cost, and customer risk.

## Hard gates
- Influence claimed but mechanism unexplained, such as “I told them to use the standard”, caps `influence_mechanism` at 1.
- A staff-level claim with only a team-local blast radius caps `scope_of_influence` at 2.

## Common failure modes
- Advocating a favourite rewrite or tool without migration cost, staffing, or business priority.
- Remaining the irreplaceable bottleneck instead of building successors.
- “I regularly helped junior engineers” with no diagnosis or outcome.
- Confusing personal output with leverage.
- Equating staff scope with bigger numbers rather than cross-team direction.
- Claiming alignment without explaining how conflicting incentives were addressed.

## Strong vs weak
- **Strong:** "I got three teams with conflicting incentives onto a shared API via RFC, integration prototype, addressing each team's migration cost, and a sequenced rollout."
  **Weak:** "I told the other teams what standard to use."
- **Strong:** "I noticed they avoided design reviews, paired on two, had them lead the third, and they became service owner."
  **Weak:** "I regularly helped junior engineers."
- **Strong:** "I translated the outage risk into delayed customer onboarding and funded a two-quarter migration."
  **Weak:** "I explained the architecture to leadership."
- **Strong:** "The checklist and owner rotation meant incidents no longer depended on me."
  **Weak:** "I became the person everyone asked."
