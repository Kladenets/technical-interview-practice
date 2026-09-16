# Notes for v2 — 07_how_you_build_software

Raw material and coaching notes captured from the session after the v1
judgement. This is scratch input for the v2 answer, not an answer itself.

## Facts added after v1 (use these — v1 had none of them)

- **Geolocation spend is down 11%** from the reliability and deduplication work
  already shipped. That brought the team **well under budget**, so there is no
  live cost pressure forcing a fast migration.
- Switching to Cloudflare could save a further **50–75%** on top.
- Sentry work produced **no direct saving**, but delivered: faster identification
  and mitigation of issues, visibility into **how often each provider fails**,
  and how often providers cannot geolocate a customer **per market**.
- Geolocation budget is in the **hundreds of thousands**; IKEA is a **~€50B**
  company. A blind migration that degrades conversion could cost **millions**.
- PII removed from Sentry logs (postal codes were being logged).
- Duplicate SDK calls removed — Google was reverse-geocoding data already
  geocoded earlier.

## Positions worth leading with

- **The broken brief.** "Cut geolocation spend" has a degenerate solution: stop
  geolocating. When the cheapest answer to a metric is obviously wrong, the
  metric is wrong — go find the counter-metric before writing code.
- **The decision rule.** Switch per market when savings exceed the conversion
  cost of any degraded experience. Costs per market are already known; the
  missing half is the accuracy delta. This rule is applicable by someone else
  without you, which is what makes it a principle rather than a preference.
- **The EV argument.** Hundreds of thousands in potential savings against
  millions in conversion risk. "I'd make this trade ten times out of ten."
- **The honest downside, owned.** The test may show Cloudflare is not good
  enough in any market. That still beats migrating blind and presenting the cost
  reduction as the whole story.

## Conditionality — the correct framing

The v1 judgement wrongly called this absolutism. It isn't, and the reasoning is:

- The test ships inside a **shared fragment consumed by all markets**, so there
  is **no per-market cost** to measuring. The condition that would normally make
  rigour not worth paying for — per-unit cost — does not exist here.
- Even smaller IKEA markets carry enough traffic for signal.
- Testing everywhere avoids knowledge gaps about which markets are viable.

State the condition explicitly rather than implying it: *the thing that would
normally make me skip measurement is per-unit cost, and a shared fragment
doesn't have one.*

## The strongest unused idea

**Leave Cloudflare on permanently in every market that does not switch**, and
watch the delta trend over time. It is free, so the evaluation stops being a
one-off project and becomes a standing signal: "should we switch yet?" becomes
answerable at any point in the next few years with no new work. Expect provider
quality to change, and this captures it.

This is a *mechanism*, not a test design. Mechanisms others can use without you
are the difference between a 2 and a 3 on `position_clarity` and
`operational_consequence`.

## Structure for v2

1. The principle — broken brief, plus the savings-vs-conversion decision rule
2. What was inherited, and what you stopped (big-bang migration, no measurement)
3. What you fixed first — observability, PII, dedup — **with the 11%**
4. The shadow design, and why not an A/B test (weeks of business risk per market)
5. What it cost, owned — plus the EV framing and "ten times out of ten"
6. Where you would skip it — the per-unit-cost condition, and why it doesn't bind
7. The standing-signal mechanism
8. Stretch: nine-person startup versus IKEA, and what that change costs

## Still missing — find these before writing

- **A provider failure rate number.** "Google fails to resolve in X% of requests
  in market Y" turns the Sentry work from an observability story into the
  justification for the whole project. You are paying that provider.
- **The delay, quantified.** How long has the measurement approach deferred the
  50–75% saving? Roughly is fine; a quarter is a number.
- **Did anyone push back on you** the way you pushed back on the previous devs?
  A named human cost is stronger than an abstract one.
- **The stretch is untouched.** You are currently living the large-organisation
  version of this. What survives at nine people, and what do you lose?

## Scores to beat

v1: overall **1.6** — position_clarity 2, grounding_in_experience 2,
tradeoff_honesty 1, conditionality 1, operational_consequence 2.

The material above should support 3s on grounding and conditionality. The
binding constraint on v2 will be **ordering**, not content: v1 scored 1.6 with
most of these ideas present but arriving in the wrong sequence.
