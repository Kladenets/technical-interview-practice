"""Tests for Problem 18: Idempotent Integration Event Processor

Run from the python/ directory:
    pytest tests/test_problem_18_integration_event_processor.py -v \
        --answer practice_problem_answers/kk_answer_18_integration_event_processor.py
"""

import pytest

from practice_problems.problem_18_integration_event_processor import IntegrationEventProcessor


# ---------------------------------------------------------------------------
# Shared timestamps
# ---------------------------------------------------------------------------
T0 = "2026-09-10T10:00:00"
T1 = "2026-09-10T10:05:00"
T2 = "2026-09-10T10:10:00"
T3 = "2026-09-10T10:15:00"


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------
@pytest.fixture
def fresh_processor():
    """Empty IntegrationEventProcessor with three allowed attempts."""
    return IntegrationEventProcessor(max_attempts=3)


@pytest.fixture
def processor():
    """
    Pre-seeded processor with pending billing quote and inventory stock events
    received in T0 then T1 order.
    """
    value = IntegrationEventProcessor(max_attempts=3)
    value.ingest_event("evt_seed_quote", "billing", "quote.updated", {"quote_id": "q1"}, T0)
    value.ingest_event("evt_seed_stock", "inventory", "stock.changed", {"sku": "s1"}, T1)
    return value


@pytest.fixture
def dead_letter_processor():
    """Processor containing one dead-letter event for Part 3 tests."""
    value = IntegrationEventProcessor(max_attempts=3)
    value.ingest_event("evt_seed_dead", "billing", "quote.updated", {}, T0)
    for error in ("one", "two", "three"):
        value.record_failure("evt_seed_dead", error, T1)
    return value


@pytest.fixture
def one_attempt_processor():
    """Empty processor that dead-letters an event on its first failure."""
    return IntegrationEventProcessor(max_attempts=1)


@pytest.fixture
def invalid_processor(request):
    """Confirm an invalid max_attempts value is rejected during construction."""
    with pytest.raises(ValueError):
        IntegrationEventProcessor(max_attempts=request.param)
    return True


# ---------------------------------------------------------------------------
# PART 1 — Ingestion and idempotency
# ---------------------------------------------------------------------------
class TestIngestEvent:
    def test_stores_event_with_pending_state(self, fresh_processor):
        event = fresh_processor.ingest_event("evt_store", "source", "changed", {"x": 1}, T0)
        assert event["status"] == "pending"
        assert event["attempts"] == 0
        assert event["payload"] == {"x": 1}

    def test_duplicate_is_same_original_object(self, fresh_processor):
        first = fresh_processor.ingest_event("evt_duplicate", "source", "changed", {"x": 1}, T0)
        second = fresh_processor.ingest_event("evt_duplicate", "other", "other", {"x": 2}, T1)
        assert second is first
        assert second["payload"] == {"x": 1}

    def test_duplicate_preserves_defensively_copied_payload(self, fresh_processor):
        payload = {"nested": ["original"]}
        event = fresh_processor.ingest_event("evt_payload_copy", "source", "changed", payload, T0)
        payload["nested"] = ["mutated"]
        fresh_processor.ingest_event("evt_payload_copy", "source", "changed", {"nested": ["new"]}, T1)
        assert event["payload"] == {"nested": ["original"]}

    def test_empty_event_id_raises(self, fresh_processor):
        with pytest.raises(ValueError):
            fresh_processor.ingest_event("", "source", "changed", {}, T0)

    def test_empty_source_raises(self, fresh_processor):
        with pytest.raises(ValueError):
            fresh_processor.ingest_event("evt_empty_source", "", "changed", {}, T0)

    def test_empty_event_type_raises(self, fresh_processor):
        with pytest.raises(ValueError):
            fresh_processor.ingest_event("evt_empty_type", "source", "", {}, T0)

    def test_empty_received_at_raises(self, fresh_processor):
        with pytest.raises(ValueError):
            fresh_processor.ingest_event("evt_empty_time", "source", "changed", {}, "")

    def test_non_dict_payload_raises(self, fresh_processor):
        with pytest.raises(ValueError):
            fresh_processor.ingest_event("evt_bad_payload", "source", "changed", [], T0)

    @pytest.mark.parametrize(
        ("event_id", "source"),
        [(123, "source"), ("evt_non_string_source", True)],
    )
    def test_non_string_metadata_raises(self, fresh_processor, event_id, source):
        with pytest.raises(ValueError):
            fresh_processor.ingest_event(event_id, source, "changed", {}, T0)


class TestInit:
    @pytest.mark.parametrize("invalid_processor", [0, -1, 3.0, "3", True], indirect=True)
    def test_invalid_max_attempts_raises(self, invalid_processor):
        assert invalid_processor is True


class TestGetEvent:
    def test_returns_stored_event(self, processor):
        assert processor.get_event("evt_seed_quote")["source"] == "billing"

    def test_returns_none_when_unknown(self, fresh_processor):
        assert fresh_processor.get_event("evt_missing") is None


class TestListEvents:
    def test_returns_events_in_receive_order(self, fresh_processor):
        fresh_processor.ingest_event("evt_order_second", "source", "changed", {}, T1)
        fresh_processor.ingest_event("evt_order_first", "source", "changed", {}, T0)
        assert [event["event_id"] for event in fresh_processor.list_events()] == ["evt_order_second", "evt_order_first"]

    def test_pending_filter_uses_only_part_one_methods(self, processor):
        assert [event["event_id"] for event in processor.list_events("pending")] == ["evt_seed_quote", "evt_seed_stock"]
        assert processor.list_events("processed") == []

    def test_unknown_status_returns_empty_list(self, processor):
        assert processor.list_events("unknown") == []


# ---------------------------------------------------------------------------
# PART 2 — Processing and retry state
# ---------------------------------------------------------------------------
class TestRegisterHandler:
    def test_re_registration_replaces_handler(self, processor):
        calls = []
        processor.register_handler("quote.updated", lambda event: calls.append("first"))
        processor.register_handler("quote.updated", lambda event: calls.append("replacement"))
        processor.process_event("evt_seed_quote")
        assert calls == ["replacement"]

    def test_empty_event_type_raises(self, fresh_processor):
        with pytest.raises(ValueError):
            fresh_processor.register_handler("", lambda event: None)

    def test_non_callable_handler_raises(self, fresh_processor):
        with pytest.raises(TypeError):
            fresh_processor.register_handler("changed", "not-a-handler")

    @pytest.mark.parametrize("event_type", [None, 1])
    def test_non_string_event_type_raises(self, fresh_processor, event_type):
        with pytest.raises(ValueError):
            fresh_processor.register_handler(event_type, lambda event: None)


class TestProcessEvent:
    def test_handler_runs_once_and_processed_filter_matches(self, processor):
        handled = []
        processor.register_handler("quote.updated", lambda event: handled.append(event["event_id"]))
        processor.process_event("evt_seed_quote")
        processor.process_event("evt_seed_quote")
        assert handled == ["evt_seed_quote"]
        assert [event["event_id"] for event in processor.list_events("processed")] == ["evt_seed_quote"]

    def test_no_handler_performs_ledger_only_transition(self, processor):
        event = processor.process_event("evt_seed_stock")
        assert event["status"] == "processed"
        assert event["attempts"] == 1

    def test_handler_receives_stored_event_dict(self, processor):
        received = []
        processor.register_handler("quote.updated", lambda event: received.append(event))
        stored = processor.process_event("evt_seed_quote")
        assert received[0] is stored
        assert received[0]["event_id"] == "evt_seed_quote"
        assert received[0]["payload"] == {"quote_id": "q1"}

    def test_handler_failure_records_retry_and_reraises(self, processor):
        def fail(_event):
            raise RuntimeError("downstream unavailable")

        processor.register_handler("quote.updated", fail)
        with pytest.raises(RuntimeError, match="downstream unavailable"):
            processor.process_event("evt_seed_quote", T2)
        event = processor.get_event("evt_seed_quote")
        assert event["status"] == "retryable"
        assert event["attempts"] == 1
        assert event["last_error"] == "downstream unavailable"

    def test_retryable_event_can_process_successfully(self, processor):
        processor.record_failure("evt_seed_quote", "temporary", T1)
        event = processor.process_event("evt_seed_quote")
        assert event["status"] == "processed"
        assert event["attempts"] == 2
        assert event["last_error"] is None

    def test_processed_event_does_not_increment_attempts_again(self, processor):
        processor.process_event("evt_seed_quote")
        processor.process_event("evt_seed_quote")
        assert processor.get_event("evt_seed_quote")["attempts"] == 1

    def test_dead_letter_event_raises(self, dead_letter_processor):
        with pytest.raises(ValueError):
            dead_letter_processor.process_event("evt_seed_dead")

    def test_unknown_event_raises(self, fresh_processor):
        with pytest.raises(KeyError):
            fresh_processor.process_event("evt_process_missing")


class TestRecordFailure:
    def test_failure_schedules_retry(self, processor):
        event = processor.record_failure("evt_seed_quote", "upstream unavailable", T2)
        assert event["status"] == "retryable"
        assert event["attempts"] == 1
        assert event["next_attempt_at"] == T2

    def test_failure_with_none_retry_time(self, processor):
        event = processor.record_failure("evt_seed_stock", "unknown schedule", None)
        assert event["status"] == "retryable"
        assert event["next_attempt_at"] is None

    def test_failure_after_max_attempts_dead_letters(self, processor):
        processor.record_failure("evt_seed_quote", "one", T1)
        processor.record_failure("evt_seed_quote", "two", T2)
        event = processor.record_failure("evt_seed_quote", "three", T3)
        assert event["status"] == "dead_letter"
        assert event["next_attempt_at"] is None

    def test_processed_event_cannot_record_failure(self, processor):
        processor.process_event("evt_seed_quote")
        with pytest.raises(ValueError):
            processor.record_failure("evt_seed_quote", "late", T1)

    def test_dead_letter_event_cannot_record_failure_or_change(self, dead_letter_processor):
        event = dead_letter_processor.get_event("evt_seed_dead")
        attempts = event["attempts"]
        last_error = event["last_error"]
        with pytest.raises(ValueError):
            dead_letter_processor.record_failure("evt_seed_dead", "late", T1)
        assert event["attempts"] == attempts
        assert event["last_error"] == last_error

    def test_unknown_event_raises(self, fresh_processor):
        with pytest.raises(KeyError):
            fresh_processor.record_failure("evt_failure_missing", "error", T1)

    def test_max_attempts_one_dead_letters_first_failure(self, one_attempt_processor):
        one_attempt_processor.ingest_event("evt_one_attempt", "source", "changed", {}, T0)
        assert one_attempt_processor.record_failure("evt_one_attempt", "fatal", T1)["status"] == "dead_letter"


class TestGetDueEvents:
    def test_boundary_is_due_and_later_retry_is_not(self, processor):
        processor.record_failure("evt_seed_quote", "due", T2)
        processor.record_failure("evt_seed_stock", "later", T3)
        assert [event["event_id"] for event in processor.get_due_events(T2)] == ["evt_seed_quote"]

    def test_dead_letters_and_pending_events_are_never_due(self, dead_letter_processor):
        dead_letter_processor.ingest_event("evt_due_pending", "source", "changed", {}, T0)
        assert dead_letter_processor.get_due_events(T3) == []

    def test_empty_when_no_retries_exist(self, fresh_processor):
        assert fresh_processor.get_due_events(T3) == []

    def test_preserves_receive_order(self, fresh_processor):
        fresh_processor.ingest_event("evt_due_first", "source", "changed", {}, T1)
        fresh_processor.ingest_event("evt_due_second", "source", "changed", {}, T0)
        fresh_processor.record_failure("evt_due_first", "one", T2)
        fresh_processor.record_failure("evt_due_second", "two", T2)
        assert [event["event_id"] for event in fresh_processor.get_due_events(T2)] == ["evt_due_first", "evt_due_second"]

    def test_retryable_event_without_schedule_is_not_due(self, processor):
        processor.record_failure("evt_seed_quote", "unscheduled", None)
        processor.record_failure("evt_seed_stock", "scheduled", T2)
        assert [event["event_id"] for event in processor.get_due_events(T3)] == ["evt_seed_stock"]


# ---------------------------------------------------------------------------
# PART 3 — Dead letters and operational controls
# ---------------------------------------------------------------------------
class TestReplayEvent:
    def test_replay_resets_dead_letter_to_pending(self, dead_letter_processor):
        event = dead_letter_processor.replay_event("evt_seed_dead")
        assert event["status"] == "pending"
        assert event["attempts"] == 0
        assert event["next_attempt_at"] is None
        assert event["last_error"] is None

    def test_replay_non_dead_letter_raises(self, processor):
        with pytest.raises(ValueError):
            processor.replay_event("evt_seed_quote")

    def test_replay_unknown_event_raises(self, fresh_processor):
        with pytest.raises(KeyError):
            fresh_processor.replay_event("evt_replay_missing")

    def test_replayed_event_can_process_successfully(self, dead_letter_processor):
        dead_letter_processor.replay_event("evt_seed_dead")
        event = dead_letter_processor.process_event("evt_seed_dead")
        assert event["status"] == "processed"
        assert event["attempts"] == 1


class TestGetDeadLetters:
    def test_empty_when_no_dead_letters(self, processor):
        assert processor.get_dead_letters() == []

    def test_returns_dead_letters_in_receive_order(self, fresh_processor):
        fresh_processor.ingest_event("evt_dead_first", "source", "changed", {}, T1)
        fresh_processor.ingest_event("evt_dead_second", "source", "changed", {}, T0)
        for event_id in ("evt_dead_first", "evt_dead_second"):
            for attempt in range(3):
                fresh_processor.record_failure(event_id, f"error-{attempt}", T2)
        assert [event["event_id"] for event in fresh_processor.get_dead_letters()] == ["evt_dead_first", "evt_dead_second"]
