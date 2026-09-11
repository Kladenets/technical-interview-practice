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

For this problem you are building an IntegrationEventProcessor class.
Store all state in instance variables initialized in `__init__`.
Class-level variables will bleed between tests and between instances — avoid them.
You choose the internal data structures — the public interface is what matters.

EVENT DATA
----------
Event:
  {
    "event_id": str, "source": str, "event_type": str, "payload": dict,
    "received_at": str, "status": str, "attempts": int,
    "next_attempt_at": str | None, "last_error": str | None,
  }

Timestamps are canonical fixed-width ISO-8601 strings of the form
YYYY-MM-DDTHH:MM:SS (no timezone offset, no fractional seconds). Because the
format is fixed-width, lexicographic string comparison is chronological
comparison. Preserve receive order in all list-returning methods. Duplicate
event IDs return the original stored event unchanged, including its original
payload.

STATE MACHINE
-------------
Allowed transitions:
  pending     → processed | retryable
  retryable   → processed | retryable | dead_letter
  dead_letter → pending (only via replay_event)
  processed   → (terminal)

PART 1 — Ingestion and idempotency  (~12 min)
--------------------------------------------
Implement `ingest_event`, `get_event`, and `list_events`. Validate event
fields and make duplicate ingestion idempotent.

PART 2 — Processing and retry state  (~18 min)
---------------------------------------------
Implement handler registration, processing, failure recording, and due-event
queries. `process_event` must call `record_failure` when a handler raises.

PART 3 — Dead letters and operational controls  (~15 min)
---------------------------------------------------------
Implement replaying and dead-letter queries. `get_dead_letters` must call
`list_events` rather than duplicate its filtering logic.

# Example
# p = IntegrationEventProcessor(max_attempts=3)
# p.ingest_event("evt-1", "billing", "quote.updated", {"quote_id": "q1"},
#                "2026-09-10T10:00:00")
# p.ingest_event("evt-1", "billing", "quote.updated", {"quote_id": "new"},
#                "2026-09-10T10:05:00")  # -> original event; no duplicate
# p.register_handler("quote.updated", lambda event: print(event["payload"]))
# p.process_event("evt-1")  # handler receives the stored event dict
# p.get_event("evt-1")["status"]  # -> "processed"
=============================================================================
"""

from typing import Callable, Optional


class IntegrationEventProcessor:
    """Manages idempotent processing and retries for integration events."""

    def __init__(self, max_attempts: int = 3):
        """
        Initialize the processor.

        max_attempts is the number of attempts after which an event is
        dead-lettered. It must be a positive int (not bool); otherwise raise
        ValueError.
        """
        # TODO: initialize your internal state here.
        # All state must be instance variables (not class variables).
        raise NotImplementedError

    # -------------------------------------------------------------------------
    # PART 1 — Ingestion and idempotency
    # -------------------------------------------------------------------------

    def ingest_event(self, event_id: str, source: str, event_type: str,
                     payload: dict, received_at: str) -> dict:
        """
        Store an event in the pending state, or return its existing stored event.

        Parameters
        ----------
        event_id, source, event_type, received_at : str
            Non-empty event metadata strings.
        payload : dict
            Event-specific data.

        Returns
        -------
        dict
            The stored event. A duplicate event_id returns the same existing
            object unchanged and does not create a duplicate.

        Raises
        ------
        ValueError
            If a metadata field is not a non-empty string or payload is not a dict.
        """
        raise NotImplementedError

    def get_event(self, event_id: str) -> Optional[dict]:
        """Return an event dict, or None when event_id is unknown."""
        raise NotImplementedError

    def list_events(self, status: Optional[str] = None) -> list[dict]:
        """Return events in receive order, optionally filtered by status."""
        raise NotImplementedError

    # -------------------------------------------------------------------------
    # PART 2 — Processing and retry state
    # -------------------------------------------------------------------------

    def register_handler(self, event_type: str, handler: Callable[[dict], None]) -> None:
        """Register or replace the one callable handler for an event type.

        Raise ValueError if event_type is not a non-empty string and TypeError
        if handler is not callable.
        """
        raise NotImplementedError

    def process_event(self, event_id: str, retry_at: Optional[str] = None) -> dict:
        """
        Process a pending or retryable event and return it.

        Each call that actually processes a pending or retryable event counts
        as one attempt. If no handler is registered for the event type, the
        attempt is treated as successful (a ledger-only transition). On
        success set status to "processed", increment attempts by 1, and clear
        next_attempt_at and last_error. Calling process_event again on an
        already-processed event is a no-op that returns the stored event
        unchanged and does not re-run the handler or increment attempts. When
        a handler raises, record the failure with str(exception) as the error
        before re-raising the original exception.

        Parameters
        ----------
        event_id : str
        retry_at : str | None
            Retry timestamp used if the handler raises.

        Returns
        -------
        dict
            The processed event, or the unchanged processed event on a repeated call.

        Raises
        ------
        KeyError
            If event_id is unknown.
        ValueError
            If the event is dead_letter and must be replayed first.
        Exception
            The original handler exception, after calling `record_failure`.
        """
        raise NotImplementedError

    def record_failure(self, event_id: str, error: str, retry_at: Optional[str]) -> dict:
        """
        Record a failed attempt and return the updated event.

        Set last_error to the supplied error string, including when the
        failure dead-letters the event.

        Parameters
        ----------
        event_id : str
        error : str
        retry_at : str | None

        Returns
        -------
        dict
            A retryable event, or a dead-letter event when attempts reaches max_attempts.

        Raises
        ------
        KeyError
            If event_id is unknown.
        ValueError
            If the event is already processed or dead_letter.
        """
        raise NotImplementedError

    def get_due_events(self, as_of: str) -> list[dict]:
        """
        Return retryable events due at or before as_of in receive order.

        Parameters
        ----------
        as_of : str

        Returns
        -------
        list[dict]
            Retryable events with a non-None next_attempt_at <= as_of.
        """
        raise NotImplementedError

    # -------------------------------------------------------------------------
    # PART 3 — Dead letters and operational controls
    # -------------------------------------------------------------------------

    def replay_event(self, event_id: str) -> dict:
        """
        Reset a dead-letter event to pending and return it.

        Parameters
        ----------
        event_id : str

        Returns
        -------
        dict
            The replayed event with attempts 0, next_attempt_at None, and last_error None.

        Raises
        ------
        KeyError
            If event_id is unknown.
        ValueError
            If the event is not dead_letter.
        """
        raise NotImplementedError

    def get_dead_letters(self) -> list[dict]:
        """Return dead-letter events in receive order via `list_events`."""
        raise NotImplementedError
