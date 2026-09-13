# Product collaboration
Practise turning product intent into shipped software with a product manager, especially when the brief is incomplete. This category tests product judgement and ownership after handoff, not influence among engineers.

## Rubric dimensions
### requirement_excavation
Measures how the candidate gets from a vague brief to the actual user problem.
**2 (solid):** Asks what was unspecified, identifies the user and underlying constraint, and changes the plan using what they learn.
**3 (staff):** Establishes repeatable discovery habits that improve product decisions beyond the immediate feature.
### scope_negotiation
Measures whether the candidate proposes a cheaper path to the intended outcome instead of simply accepting or refusing scope.
**2 (solid):** Offers a bounded alternative, explains what it covers and misses, and reaches an explicit product decision.
**3 (staff):** Uses evidence and sequencing to reshape roadmap choices across initiatives.
### technical_translation
Measures how technical cost, risk, and tradeoffs are explained to non-engineers.
**2 (solid):** Frames options in customer, delivery, revenue, reliability, or compliance consequences rather than implementation detail.
**3 (staff):** Gives stakeholders a durable way to make risk and investment choices without engineering mediation.
### autonomous_drive
Measures what the candidate does after handoff when nobody is directing the next step.
**2 (solid):** Independently unblocks discovery and delivery, makes reversible decisions, and escalates only consequential uncertainty.
**3 (staff):** Creates clarity and momentum for connected work while making other owners more effective.
### delivery_judgment
Measures how the candidate sequences, slices, ships, and responds to changing scope.
**2 (solid):** Delivers a testable narrow slice, makes now-versus-later choices explicit, and protects the key outcome through change.
**3 (staff):** Designs delivery strategy that manages dependencies and learning across a product area.
### customer_grounding
Measures whether decisions connect to real users and evidence rather than the ticket alone.
**2 (solid):** Uses named users, customer feedback, support evidence, or a metric to validate an assumption or outcome.
**3 (staff):** Builds feedback loops that routinely connect product and engineering decisions to customer evidence.

## Hard gates
- An answer where the candidate only executes a spec and never questions it caps `requirement_excavation` at 1.
- Pushback described as escalation or refusal with no alternative offered caps `scope_negotiation` at 1.
- No named user, customer, or metric anywhere caps `customer_grounding` at 0.

## Common failure modes
- Treating the PM as a requirements pipe.
- "I just build what's specced."
- Framing pushback as engineering purity, a rewrite, tech debt, or "not clean" with no user or business framing.
- Announcing a scope cut rather than negotiating it.
- Discovering the real requirement only after building.
- Giving no evidence of talking to a user or reading a support ticket.
- Describing process such as agile or refinement instead of a decision personally made.

## Strong vs weak
- **Strong:** "The brief said 'add export to CSV'. I asked what they did with the file — it turned out three of four customers pasted it into the same reconciliation sheet, so I shipped a filtered report view first and CSV export a sprint later."
  **Weak:** "I built the CSV export as specced."
- **Strong:** "I told the PM the full version was six weeks and showed them a two-week version that covered the top two of five cases, so we could put it in front of the pilot customer and learn."
  **Weak:** "I told them the estimate was too aggressive."
- **Strong:** "I described the integration risk as a chance the broker would see stale eligibility at enrollment, then gave the CPO a slower live lookup and a faster cached option with the failure behaviour of each."
  **Weak:** "I explained that cache invalidation would be complicated."
- **Strong:** "After handoff, I pulled five support conversations, mapped the unknown API fields, made the reversible UI decision, and brought the PM one question whose answer changed which member journey we launched."
  **Weak:** "I waited for product to clarify the requirements."
- **Strong:** "When a new approval path appeared mid-build, I showed the PM which launch metric it protected and moved it behind a feature flag, preserving the original pilot date while scheduling the full workflow."
  **Weak:** "We added the new requirement and slipped the deadline."
