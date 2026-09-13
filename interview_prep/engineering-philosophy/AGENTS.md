# Engineering philosophy
This category practises defensible positions on everyday engineering choices. Senior and staff loops use it to distinguish lived judgement from rehearsed consensus.

## Rubric dimensions
### position_clarity
Measures whether the answer makes a falsifiable claim rather than hedging.
**2 (solid):** States a clear position and the decision it changes.
**3 (staff):** Frames a durable principle that helps others make aligned decisions.

### grounding_in_experience
Measures whether a specific lived incident produced or tested the belief.
**2 (solid):** Connects the position to a concrete project, outcome, and lesson.
**3 (staff):** Shows repeated experience across contexts and how it shaped team practice.

### tradeoff_honesty
Measures whether the answer names costs, losers, and friction created by the position.
**2 (solid):** Names a real cost or stakeholder burden they accepted.
**3 (staff):** Explains how they budget, communicate, and revisit that cost organisationally.

### conditionality
Measures whether the candidate can say when the position is wrong.
**2 (solid):** Gives practical conditions that would change the decision.
**3 (staff):** Adapts the principle to risk, team maturity, and organisational constraints.

### operational_consequence
Measures how the philosophy appears in planning, PRs, reviews, or delivery.
**2 (solid):** Describes repeatable day-to-day behaviours, not just a belief.
**3 (staff):** Has changed shared mechanisms or norms beyond their own work.

## Hard gates
- A position with no cost named caps `tradeoff_honesty` at 0 and overall at 1.5.
- Pure consensus-restating with no falsifiable claim caps overall at 1.0.
- An absolute rule with no stated exception caps `conditionality` at 1.

## Common failure modes
- Restating industry consensus as a personal view.
- Saying “it depends” without decision criteria.
- Treating a preference as a principle.
- Claiming absolutism such as universal coverage targets.
- Naming no incident that made the belief costly.
- Describing a view that never affects working behaviour.

## Strong vs weak
- **Strong:** "I stopped demanding unit tests for thin adapters after mock churn blocked thirty PRs and caught nothing."
  **Weak:** "I believe in testing at the right level."
- **Strong:** "I reserve debt work when its interest is visible in lead time or incidents, not when the code merely looks old."
  **Weak:** "We should always pay down technical debt."
- **Strong:** "A review earns its cost when it tests a decision; style comments belong in automation."
  **Weak:** "Code review is important for quality."
- **Strong:** "I duplicate while two callers are still evolving independently, then abstract around the stable seam."
  **Weak:** "I avoid duplication wherever possible."
- **Strong:** "For a launch with reversible data, I ship the narrow path and schedule polish only after support signals show it matters."
  **Weak:** "I balance speed and quality."
