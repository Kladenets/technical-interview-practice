# Stage 02 — The agent loop

**Time:** ~1.5 hours
**You will learn:** Multi-step agent trajectories are bounded, inspectable conversations, not one opaque request.

## The idea
Multi-step tool calling is a conversation whose participants include your services. When a model requests a tool, the runtime records that call and its result in the message history before asking the model for another turn. `result.steps` is the inspectable record of those model turns: each step shows what was generated and, where applicable, what tool work occurred. It is not merely logging. The accumulated history gives the next step access to the dependent list, plan record, or error returned by earlier work, while preserving enough evidence to debug a trajectory later.

The model may chain tools because it decides that another fact is required. That is different from your application orchestrating a fixed workflow. For example, a claims export that must always validate, authorize, and persist in a prescribed order should be server orchestration, not a model choice. A benefits question is a good agentic chain: the model may first discover a dependent's plan, then choose to retrieve benefits for that returned plan, or may answer directly if the question is procedural. Use model-led chaining where judgment over information gathering is useful; use code-led sequencing where correctness requires a known path.

Every trajectory needs a step limit. Models can misread a result, repeatedly call the same tool, or keep retrying a transient failure. Each turn consumes tokens and each call may consume rate limits, latency, and real money. A cap is not an optimization; it is a failure boundary. It gives the surrounding application a predictable maximum amount of work and makes a runaway path visible in `result.steps`. Production systems commonly add per-tool limits, deadlines, and monitoring too, but a small hard cap is the first reliable control.

Imagine the question, “What benefits cover Ada's dependent?” The model calls `listDependents(member-ada)`. The service returns Lina with a `planId`; only then can the model propose `getPlanBenefits` using that returned identifier. The runtime appends both results, and the model writes a grounded answer. If the first service throws because the core system is unavailable, the tool should return an error-shaped result rather than reject the whole run. The next model turn can explain the outage or choose a safe alternative. If the exception escapes, there is no second turn, no helpful response, and no trajectory showing how the model handled the failure.

## What you are building
Implement read tools for dependents and plan benefits. Run them through a three-step loop and catch backend exceptions inside each tool as `{ error }` results.

## Run it
```sh
npx vitest run src/stages/stage_02_agent_loop/
npm run live:02 # optional, needs ANTHROPIC_API_KEY
```

## Key APIs
```ts
execute: async input => { try { return await service(input); } catch (error) { return { error: String(error) }; } }
```

## Watch out for
- The model can skip a tool; do not assume a fixed path in production.
- Bound each trajectory with `stepCountIs`.
- Never discard tool errors before the model can formulate a helpful response.

## Interview talking points
- I inspect per-step trajectories, not only final text, when evaluating agents.
- Step limits are reliability and cost controls.
- Tool failures are modeled data for the agent, with operational logging alongside them.
