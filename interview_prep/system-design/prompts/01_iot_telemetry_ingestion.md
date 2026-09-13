# IoT Telemetry Ingestion

**Level:** senior
**Time:** 45m

Design a service that receives telemetry from a fleet of connected devices and makes recent readings available to operators. Devices can reconnect and resend data after losing connectivity.

## Cover
- Clarify ingestion rate, retention, freshness, ordering, and duplicate-handling requirements
- Describe the write path from device through durable storage and the operator read path
- Deep-dive idempotency, partitioning, and late or out-of-order events
- Size the critical bottleneck and describe failure and degraded behaviour

## Stretch
- Explain how tenants can have different retention and alerting policies
- Include rollout metrics and cost controls for rapid fleet growth
