---
answer: kk_answer_07_how_you_build_software
category: engineering-philosophy
date: 2026-09-14
overall: 1.6
level_assessment: senior
verdict: borderline
top_gap: "You overruled a planned migration and instrumented first, but never say what that cost or what it has bought. No outcome, no number, no price paid."
dimensions:
  position_clarity: 2
  grounding_in_experience: 2
  tradeoff_honesty: 1
  conditionality: 1
  operational_consequence: 2
---

## Verdict

The work described here is senior work. The telling of it is not yet. You made a
genuinely good call — you inherited a big-bang migration with no measurement,
stopped it, fixed observability, and designed a shadow comparison that gets you
per-market evidence without exposing a market to a bad provider. That is a
better instinct than most candidates bring.

But the answer buries the decision inside a narrative, opens on a sentence any
candidate could say, names no cost for the delay you introduced, gives no
condition under which you would have let the migration proceed, and ends with
"that code has yet to go out." An interviewer hears a strong engineer who cannot
yet tell them why they should be impressed. That is the entire gap between this
and a 2.4.

## Dimensions

### position_clarity — 2/3, solid

**Evidence:** "This was a step backward from the approach of the devs I took over
for, who had planned to migrate everyone to cloudflare all at once, no conversion
tracking, no geolocation quality data, which I pushed back pretty hard on."

**Present:** There is a real, falsifiable position here and it changed a concrete
decision: do not migrate a working system to a cheaper one until you can measure
what the cheaper one costs you in quality. You acted on it against existing plans.

**Missing:** You never state it as a principle. It has to be reconstructed from
the story by the listener, and in a 45-minute conversation the listener will not
do that work. Your opening line — "I think it's important to establish
requirements for the solution and what 'success' looks like" — is what a weak
candidate says. The strong version of your own view is roughly *"a cost-reduction
brief that defines its own success metric is a trap, because the cheapest version
of geolocation is no geolocation."* You have that thought; you just put it third
instead of first.

### grounding_in_experience — 2/3, solid

**Evidence:** "most of the geolocation errors weren't being logged to sentry, and
the ones that were used to include protected information like postal codes, which
I removed... we were duplicating calls to the SDK and driving up our bill, using
Google to reverse geocode data we'd already geocoded earlier."

**Present:** Dense, specific, unmistakably real. Named systems, named providers, a
named failure of the inherited code, and a PII leak you personally found and
fixed. This is not a rehearsed anecdote and it reads that way, which is good.

**Missing:** The belief was *produced* by this incident but has not been *tested*
by it. Nothing has an outcome. How much was the duplicate reverse-geocoding
costing per month, and what happened to the bill when you removed it? What did
the Sentry fix reveal once errors were actually visible — was it SDK load
failures, or resolution failures, and in what proportion? You have these numbers
or can get them. Without one, the story is "I did sensible work" rather than "I
did sensible work and here is what it returned."

### tradeoff_honesty — 1/3, partial

**Evidence:** "This was a step backward from the approach of the devs I took over
for."

**Present:** A glancing acknowledgement that your approach cost schedule time,
and a clear articulation of the *product* tension between spend and accuracy.

**Missing:** The cost of **your own position**, owned and priced. You overruled a
team's plan and the saving they were chasing still has not landed — the answer
literally ends on that. How many months of geolocation spend has the measurement
approach cost? What does running both providers during the shadow period cost?
What extra analytics volume and client-side work did you add? Who was annoyed —
did the original devs think you were gold-plating, did a manager ask why the
savings slipped? Naming a real cost you accepted is the single loudest senior
signal in this category, and right now you are describing a decision with no
downside, which reads as either unexamined or rehearsed.

The product-level cost/accuracy tension does not count here. That is a tradeoff
the *business* faces. The rubric is asking what *your* method costs.

### conditionality — 1/3, partial

**Evidence:** "we don't have to disrupt the market with an AB test which could
negatively impact business for weeks depending on how cloudflare performs in that
market."

**Present:** You give a reason for choosing shadow comparison over an A/B test,
which is decision criteria of a kind.

**Missing:** Any statement of when you would *not* do this. Would you have let the
big-bang migration go ahead in a small market where the blast radius was three
weeks of slightly worse zip codes? If Cloudflare had been within 500 metres in
every market on day one, would you still have built the comparison harness? If
the provider contract had been cancelling in 30 days, what would you have cut?
A senior answer names the conditions under which its own rigour is not worth
paying for. Yours implies the measurement is always correct, which is the
absolutism the rubric penalises.

### operational_consequence — 2/3, solid

**Evidence:** "I reached out to our data and analytics team to see if they could
provide me with measurable data points... calculate the delta between the
lat/long coordinates returned from it and what we get from cloudflare, sending
that to our analytics along with if the postal code matched."

**Present:** The philosophy is visible in what you actually did day to day —
pulling in analytics before writing code, fixing observability as step one,
designing the instrument before the migration. These are repeatable behaviours,
not a belief.

**Missing:** Evidence it changed anything beyond your own work. You pushed back on
one plan; you did not describe turning "instrument before you migrate" into
something the team now does by default — a checklist, a review question, a
template, a norm. That is the gap between 2 and 3, and it is also exactly what a
nine-person startup will want from a senior hire.

## Top 3 fixes

1. **Lead with the position, not the project.** Open with the trap: a
   cost-reduction brief whose cheapest solution is to delete the feature. Two
   sentences. Then the project as evidence. Right now your best idea arrives in
   sentence four and is phrased as a platitude.
2. **Price your own decision.** State what pushing back cost — months of deferred
   savings, the dual-provider spend during shadow, the political cost of
   overruling an existing plan — and say you would pay it again, and why.
3. **Land one number.** The duplicate reverse-geocoding fix and the Sentry work
   are both finished. Give a figure for either. "That code has yet to go out" is
   currently the last thing the interviewer hears; make sure it is not the only
   outcome they hear.

## Rewrite of the weakest passage

**Yours:**

> "Before beginning work, I think it's important to establish requirements for
> the solution and what 'success' looks like. In this case, one of our goals was
> to reduce the geolocation spend, which we could do easily by not geolocating at
> all anymore - problem solved? Obviously not..."

**Senior-grade:**

> "The brief was 'cut geolocation spend', and the cheapest way to satisfy that
> brief is to stop geolocating entirely. When the degenerate solution to a metric
> is that obviously wrong, the metric is wrong — so my first move was to go find
> the counter-metric before writing any code. I went to data and analytics and
> asked what a wrong postal code actually costs us: what happens to conversion
> when a user has to correct their zip, and what happens when availability
> changes after they correct it. Navigation is upper funnel so that attribution
> is genuinely hard, and I accepted a weaker number rather than no number. It
> delayed the saving we'd been asked for by about a quarter. I'd do it again,
> because the plan I inherited would have migrated every market at once with no
> way to detect that we'd made accuracy worse."

Same facts, all yours. The difference is that the position leads, the cost is
named and owned, and the number is attached.

## Follow-ups an interviewer would ask

1. You stopped a migration your predecessors had planned. How much did that
   delay the savings, and what would you have needed to see to let it proceed as
   originally scoped?
2. The comparison code still hasn't shipped and you've been pulled onto tech debt
   and a monorepo migration. How do you decide that ordering, and who agreed it?
3. You're measuring lat/long deltas — what delta actually matters to a customer?
   How do you turn a distance into a per-market go/no-go threshold?
4. GPS is your ground truth, but only consenting users provide it. How do you
   know that population isn't biased in a way that flatters one provider?
5. What's your call if Cloudflare is better in twenty markets and clearly worse in
   three?
