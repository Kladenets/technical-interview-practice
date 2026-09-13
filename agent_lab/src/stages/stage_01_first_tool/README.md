# Stage 01 — Your first tool call

**Time:** ~1 hour
**You will learn:** An agent is a model loop that proposes tool calls through a constrained computer interface.

## The idea
An agent is not a mysterious new kind of backend. At its smallest, it is a language model in a loop with tools. On each turn the model receives messages and either writes an answer or emits a structured request to use one tool. Your application, not the model, owns the tools and decides whether to execute that request. The state of the loop is the message history: the user question, model output, and any tool results appended after a call. That history is what lets a later model turn reason from facts it did not initially know.

Tools are the agent's computer interface. A tool name, its description, and its input schema tell the model what operation exists, when it is appropriate, and exactly what it may supply. Those are interface design decisions, not incidental documentation strings. A vague description or permissive schema makes the model's available computer unreliable; a precise schema constrains it to an operation your system can safely understand. The model receives no direct database handle or HTTP credential. It can only propose a call through the narrow interface you publish.

If you have built MCP servers, you have already built the tool side of exactly this protocol: named capabilities with schemas and returned content. What is new here is who runs the loop. With MCP, a program caller may decide which tool to invoke. In an agent, the caller is a model, and your orchestration code repeatedly gives that model its messages, validates its proposed call, runs an allowed tool, and records the result. The model's tool call is therefore intent, not authority and not execution by itself.

Consider a coverage lookup. A user asks whether Ada is covered. The model first proposes `lookupCoverage` with Ada's model-facing member reference. At this stage that reference is a reversible base64url wrapper, so it is deliberately neither secret nor a security boundary. It becomes an opaque reference only in Stage 06, when the resolver is swapped for one that prevents model-facing values from revealing backend identifiers. Your code validates that the argument matches the Zod schema, decides this read-only call is allowed, runs it, and adds Ada's returned record to the history. On the next turn, the model sees `coverageStatus: active` and writes the answer. If you skipped validation, a malformed identifier could reach the backend. If you forgot to return the tool result to history, the model would have no grounded fact and might invent an answer. A two-step cap also matters: a model that keeps proposing lookups must not create an unlimited bill.

The distinction between a reference and an authorization decision is worth keeping precise. Encoding a value can make an interface less convenient to misuse, but it does not establish that a caller may access the underlying record. The tool implementation still resolves the reference in server code, scopes the lookup to the applicable tenant, and returns only the information its contract permits. In production, the reference format can also support expiry, rotation, or an indirection table; those are useful properties, but they are separate from the basic fact that the model never receives a database credential. Treat every value from the model as untrusted structured input, whether it looks like a friendly label, a UUID, or an encoded reference.

This small exercise intentionally focuses on a read. A read tool still needs a clear contract because its output becomes evidence in the model context and can influence a later recommendation. The later stages add proposal, approval, execution, and data-boundary concerns without changing this foundational ownership rule: model output asks the application to do something, and application code validates and carries out only the allowed operation. Starting with this limited loop makes it easier to inspect the messages, the schema, the stop condition, and the returned result before consequential writes enter the picture.

## What you are building
Implement `answerCoverageQuestion`: expose the supplied read-only `lookupCoverage` tool to `generateText`, pass the user question, and cap the loop at two steps. Return the full result.

## Run it
```sh
npx vitest run src/stages/stage_01_first_tool/
npm run live:01 # optional, needs ANTHROPIC_API_KEY
```

## Key APIs
```ts
const result = await generateText({ model, prompt, tools: { lookupCoverage }, stopWhen: stepCountIs(2) });
```

## Watch out for
- A tool call is a proposal, not backend authorization.
- Schema names and tool names must match the model’s call exactly.
- Without a stop condition, an accidental loop can spend unbounded tokens.

## Interview talking points
- I treat a tool call as model-generated intent, never direct backend access.
- MCP gave me the tool contract; agent orchestration adds the iterative loop.
- I cap tool trajectories to bound cost and failure modes.
