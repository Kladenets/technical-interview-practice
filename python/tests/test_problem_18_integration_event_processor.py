import pytest

from practice_problems.problem_18_integration_event_processor import IntegrationEventProcessor

T0 = "2026-09-10T10:00:00"
T1 = "2026-09-10T10:05:00"
T2 = "2026-09-10T10:10:00"


@pytest.fixture
def fresh_processor():
    return IntegrationEventProcessor(max_attempts=3)


@pytest.fixture
def processor():
    value = IntegrationEventProcessor(max_attempts=3)
    value.ingest_event("evt-1", "billing", "quote.updated", {"quote_id": "q1"}, T0)
    value.ingest_event("evt-2", "inventory", "stock.changed", {"sku": "s1"}, T1)
    return value


class TestIngestion:
    def test_stores_event_with_pending_state(self, fresh_processor):
        event = fresh_processor.ingest_event("evt-store", "source", "changed", {"x": 1}, T0)
        assert event["status"] == "pending"
        assert event["attempts"] == 0
        assert event["payload"] == {"x": 1}

    def test_duplicate_event_id_is_idempotent(self, fresh_processor):
        first = fresh_processor.ingest_event("evt-dup", "source", "changed", {"x": 1}, T0)
        second = fresh_processor.ingest_event("evt-dup", "source", "changed", {"x": 2}, T1)
        assert second is first
        assert second["payload"] == {"x": 1}
        assert len(fresh_processor.list_events()) == 1

    def test_filters_events_by_status(self, processor):
        processor.process_event("evt-1")
        assert [event["event_id"] for event in processor.list_events("processed")] == ["evt-1"]

    def test_unknown_event_returns_none(self, fresh_processor):
        assert fresh_processor.get_event("missing") is None


class TestProcessing:
    def test_processes_pending_event_once(self, processor):
        event = processor.process_event("evt-1")
        again = processor.process_event("evt-1")
        assert event["status"] == "processed"
        assert event["attempts"] == 1
        assert again is event

    def test_unknown_event_raises(self, fresh_processor):
        with pytest.raises(KeyError):
            fresh_processor.process_event("missing")

    def test_failure_schedules_retry(self, processor):
        event = processor.record_failure("evt-1", "upstream unavailable", T2)
        assert event["status"] == "retryable"
        assert event["attempts"] == 1
        assert event["next_attempt_at"] == T2
        assert processor.get_due_events(T2)[0]["event_id"] == "evt-1"

    def test_failure_after_max_attempts_dead_letters(self, processor):
        processor.record_failure("evt-1", "one", T1)
        processor.record_failure("evt-1", "two", T2)
        event = processor.record_failure("evt-1", "three", T2)
        assert event["status"] == "dead_letter"
        assert event["next_attempt_at"] is None


class TestReplay:
    def test_replay_resets_dead_letter_to_pending(self, fresh_processor):
        fresh_processor.ingest_event("evt-replay", "source", "changed", {}, T0)
        for number in range(3):
            fresh_processor.record_failure("evt-replay", str(number), T1)
        event = fresh_processor.replay_event("evt-replay")
        assert event["status"] == "pending"
        assert event["attempts"] == 0
        assert event["last_error"] is None

    def test_dead_letters_are_filterable(self, fresh_processor):
        fresh_processor.ingest_event("evt-dead", "source", "changed", {}, T0)
        for number in range(3):
            fresh_processor.record_failure("evt-dead", str(number), T1)
        assert [event["event_id"] for event in fresh_processor.get_dead_letters()] == ["evt-dead"]