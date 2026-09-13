# Member Document Delivery

**Level:** senior
**Time:** 20m
**Context:** mongoose

Design a small flow for a member-facing insurance portal: a user requests a coverage document, the platform generates the current version and makes it available securely. The 20-minute limit is part of the exercise: establish requirements quickly, draw one coherent flow, and prioritise one tradeoff and one failure mode rather than designing every subsystem.

## Cover
- State the users, access control, freshness, latency, durability, and scope assumptions that shape the design
- Explain the request, generation, secure delivery, and status/retry flow end to end
- Choose one tradeoff and one failure mode, including the user-visible degraded behaviour and operational signal

## Stretch
- Explain how you would add asynchronous generation for a slow source without changing the client contract
