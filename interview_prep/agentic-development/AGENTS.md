# Agentic development
This category practises calibrated use of AI-assisted coding tools. It matters because senior and staff engineers must create leverage without lowering correctness, ownership, or review standards.

## Rubric dimensions
### concrete_workflow
Measures whether the candidate describes an actual repeatable tool workflow.
**2 (solid):** Names tools, inputs, hand-offs, and review steps from real work.
**3 (staff):** Shapes a workflow that others can use safely and consistently.

### task_triage
Measures how they decide what to delegate, retain, or split.
**2 (solid):** Uses explicit task properties such as novelty, blast radius, and reversibility.
**3 (staff):** Applies triage across team constraints, ownership, and delivery economics.

### verification_discipline
Measures how generated output is inspected, tested, and challenged.
**2 (solid):** Reviews output like a colleague’s change and names concrete checks.
**3 (staff):** Builds verification into team pipelines or review norms.

### failure_awareness
Measures lived failures and the resulting guardrails.
**2 (solid):** Names a specific failure personally encountered and an adopted safeguard.
**3 (staff):** Anticipates recurring failure classes and evaluates safeguards with evidence.

### team_and_org_impact
Measures attention to review load, standards, onboarding, and ownership.
**2 (solid):** Explains a material effect on collaborators and responds to it.
**3 (staff):** Has changed team practice while accounting for second-order effects.

### judgment_on_limits
Measures where and why the candidate refuses tool use.
**2 (solid):** Draws justified boundaries for sensitive or correctness-critical work.
**3 (staff):** Maintains a clear organisational position on genuine leverage and acceptable risk.

## Hard gates
- Generic usage with no named tool, workflow, or example caps overall at 1.0.
- No verification story caps overall at 1.5.
- Treating generated changes as unowned caps `team_and_org_impact` at 1.

## Common failure modes
- Uncritical enthusiasm with no named failure.
- Blanket dismissal without recent evidence.
- Describing capability rather than personal practice.
- Treating generated code as exempt from review.
- Measuring success in lines produced rather than outcomes.
- Ignoring ownership, skill atrophy, or review bottlenecks.

## Strong vs weak
- **Strong:** "I write the first migration by hand, then diff each generated file against that reference because it once changed an error branch silently."
  **Weak:** "It saves me time on boilerplate."
- **Strong:** "I delegate repetitive edits with narrow tests, but keep authorization rules because the model lacks our threat context."
  **Weak:** "AI can handle the easy work."
- **Strong:** "The assistant invented a configuration key, so now I require source links for unfamiliar APIs before accepting its suggestion."
  **Weak:** "Sometimes it hallucinates."
- **Strong:** "I count reviewer minutes and escaped defects, not generated lines, when deciding whether the workflow pays off."
  **Weak:** "The team is more productive now."
- **Strong:** "Our policy makes the author accountable for every generated line and keeps sensitive repositories out of external tools."
  **Weak:** "We should encourage everyone to use AI."
