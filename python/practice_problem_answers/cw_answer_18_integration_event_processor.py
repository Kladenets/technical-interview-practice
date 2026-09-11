from typing import Optional


class IntegrationEventProcessor:
    def __init__(self, max_attempts: int = 3):
        if max_attempts <= 0:
            raise ValueError("max_attempts must be positive")
        self._events = {}
        self._max_attempts = max_attempts

    def ingest_event(self, event_id, source, event_type, payload, received_at):
        if event_id in self._events:
            return self._events[event_id]
        event = {
            "event_id": event_id,
            "source": source,
            "event_type": event_type,
            "payload": dict(payload),
            "received_at": received_at,
            "status": "pending",
            "attempts": 0,
            "next_attempt_at": None,
            "last_error": None,
        }
        self._events[event_id] = event
        return event

    def get_event(self, event_id: str) -> Optional[dict]:
        return self._events.get(event_id)

    def list_events(self, status: Optional[str] = None) -> list:
        events = list(self._events.values())
        if status is not None:
            events = [event for event in events if event["status"] == status]
        return events

    def process_event(self, event_id: str) -> dict:
        event = self._events.get(event_id)
        if event is None:
            raise KeyError(event_id)
        if event["status"] == "dead_letter":
            raise ValueError("dead-letter events must be replayed first")
        if event["status"] == "processed":
            return event
        event["status"] = "processed"
        event["attempts"] += 1
        event["next_attempt_at"] = None
        event["last_error"] = None
        return event

    def record_failure(self, event_id: str, error: str, retry_at: str) -> dict:
        event = self._events.get(event_id)
        if event is None:
            raise KeyError(event_id)
        if event["status"] == "processed":
            raise ValueError("processed events cannot fail")
        event["attempts"] += 1
        event["last_error"] = error
        if event["attempts"] >= self._max_attempts:
            event["status"] = "dead_letter"
            event["next_attempt_at"] = None
        else:
            event["status"] = "retryable"
            event["next_attempt_at"] = retry_at
        return event

    def get_due_events(self, as_of: str) -> list:
        return [
            event
            for event in self._events.values()
            if event["status"] == "retryable"
            and event["next_attempt_at"] is not None
            and event["next_attempt_at"] <= as_of
        ]

    def replay_event(self, event_id: str) -> dict:
        event = self._events.get(event_id)
        if event is None:
            raise KeyError(event_id)
        if event["status"] != "dead_letter":
            raise ValueError("only dead-letter events can be replayed")
        event["status"] = "pending"
        event["attempts"] = 0
        event["next_attempt_at"] = None
        event["last_error"] = None
        return event

    def get_dead_letters(self) -> list:
        return self.list_events(status="dead_letter")