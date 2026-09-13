# Testing Non-Deterministic Features

**Level:** senior
**Time:** 25m
**Context:** mongoose

You are shipping an AI-assisted feature whose response can vary between runs, and a prompt or model version may change its behaviour. Describe a concrete evaluation and release workflow that makes a justified ship decision rather than pretending the output can be unit-tested as exact text.

## Cover
- Describe a repeatable workflow and artefacts for separating deterministic assertions from qualitative or probabilistic evaluation
- Explain regression evaluation across prompt and model versions, including representative cases, thresholds, baselines, and reviewer hand-offs
- Define what a failed evaluation means, how you investigate it, and which failures block a release versus trigger monitoring or human review
- State how CI changes for non-deterministic checks, including cost, flakiness, reproducibility, and the verification you retain outside the model
- Draw limits on claims the feature can make and on situations where it should not be shipped without a deterministic fallback

## Stretch
- Explain how you would convince a sceptical reviewer the feature is safe to ship with evidence, not confidence in the model
