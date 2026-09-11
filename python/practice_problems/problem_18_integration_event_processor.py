"""
=============================================================================
INTERVIEW PROBLEM 18: Idempotent Integration Event Processor
Difficulty: Senior Software Engineer | Estimated time: 45 min
=============================================================================

CONTEXT
-------
You're building an integration boundary that receives webhook events from
external systems. Providers retry requests, events can arrive out of order,
and an operator needs to see whether work succeeded, is waiting to retry, or
has been moved to a dead-letter queue.

Store all state in instance variables initialized in __init__. You choose the
internal data structures; the public interface is what matters.

Event dictionaries have this shape:
  {
    "event_id": str,
    "source": str,
    "event_type": str,
    "payload": dict,
    "received_at": str,
    "status": "pending" | "processed" | "retryable" | "dead_letter",
    "attempts": int,
    "next_attempt_at": str | None,
    "last_error": str | None,
  }

# Example
# p = IntegrationEventProcessor(max_attempts=3)
# p.ingest_event("evt-1", "billing", "quote.updated", {"quote_id": "q1"}, T0)
# p.process_event("evt-1")
# p.get_event("evt-1")["status"]  # -> "processed"
# p.ingest_event("evt-1", "billing", "quote.updated", {"quote_id": "q1"}, T1)
# # -> the original event, without creating a duplicate
=============================================================================
"""

from typing import Optional


class IntegrationEventProcessor:
    def __init__(self, max_attempts: int = 3):
        self._events = {}
        self._max_attempts = max_attempts

    # -------------------------------------------------------------------------
    # PART 1 - Ingestion and idempotency
    # -------------------------------------------------------------------------

    def ingest_event(
        self,
        event_id: str,
        source: str,
        event_type: str,
        payload: dict,
        received_at: str,
    ) -> dict:
        """Store an event, returning the existing event for duplicate IDs."""
        raise NotImplementedError

    def get_event(self, event_id: str) -> Optional[dict]:
        """Return an event or None when it is unknown."""
        raise NotImplementedError

    def list_events(self, status: Optional[str] = None) -> list:
        """Return events in received order, optionally filtered by status."""
        raise NotImplementedError

    # -------------------------------------------------------------------------
    # PART 2 - Processing and retry state
    # -------------------------------------------------------------------------

    def process_event(self, event_id: str) -> dict:
        """Mark a pending or retryable event as processed exactly once."""
        raise NotImplementedError

    def record_failure(self, event_id: str, error: str, retry_at: str) -> dict:
        """Record a failed attempt and schedule retry or dead-letter it."""
        raise NotImplementedError

    def get_due_events(self, as_of: str) -> list:
        """Return retryable events whose next attempt is at or before as_of."""
        raise NotImplementedError

    # -------------------------------------------------------------------------
    # PART 3 - Dead letters and operational controls
    # -------------------------------------------------------------------------

    def replay_event(self, event_id: str) -> dict:
        """Move a dead-letter event back to pending with its attempt count reset."""
        raise NotImplementedError

    def get_dead_letters(self) -> list:
        """Return dead-letter events in original receive order."""
        raise NotImplementedError