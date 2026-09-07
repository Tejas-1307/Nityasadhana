from dataclasses import dataclass
from datetime import date, timedelta
from statistics import median

from app.models.domain import Report

CONFIG = {
    "minimum_history": 5,
    "japa_observe": 20,
    "japa_follow": 40,
    "wake_observe": 30,
    "wake_follow": 75,
    "sleep_observe": 20,
    "sleep_follow": 35,
    "waste_observe": 30,
    "waste_follow": 60,
    "activity_observe": 40,
    "activity_follow": 60,
}


def time_minutes(value: str | None) -> int | None:
    if not value: return None
    parts = value.strip().upper().replace("AM", "").replace("PM", "").strip().split(":")
    hours, mins = int(parts[0]), int(parts[1]) if len(parts) > 1 else 0
    if "PM" in value.upper() and hours < 12: hours += 12
    if "AM" in value.upper() and hours == 12: hours = 0
    return hours * 60 + mins


def signal(kind: str, level: str, title: str, reason: str, student_id: int, metric: str | None = None, dimension: str = "reporting", metadata: dict | None = None) -> dict:
    return {"type": kind, "level": level, "title": title, "reason": reason, "metric": metric, "dimension": dimension, "studentId": str(student_id), "metadata": metadata or {}}


def assess(student_id: int, current: Report | None, reports: list[Report], today: str) -> dict:
    past = [r for r in reports if r.practice_date < today and r.status == "submitted"]
    sufficient = len(past) >= CONFIG["minimum_history"]

    def med(values):
        valid = [float(v) for v in values if v is not None]
        return round(float(median(valid)), 1) if valid else None

    wake = med([time_minutes(r.wake_up_time) for r in past if r.wake_up_time])
    rounds = med([r.total_rounds for r in past if r.total_rounds is not None])
    reading = med([r.reading_duration_minutes for r in past if r.reading_duration_minutes is not None])
    hearing = med([r.hearing_duration_minutes for r in past if r.hearing_duration_minutes is not None])
    study = med([r.total_study_duration_minutes for r in past if r.total_study_duration_minutes is not None])
    waste = med([r.time_wasted_duration_minutes for r in past if r.time_wasted_duration_minutes is not None])
    sleep = med([r.sleep_duration_minutes for r in past if r.sleep_duration_minutes is not None])
    baseline = {
        "medianWakeUpMinutes": wake,
        "medianTotalRounds": rounds,
        "medianReadingMinutes": reading,
        "medianHearingMinutes": hearing,
        "medianStudyMinutes": study,
        "medianTimeWastedMinutes": waste,
        "medianSleepDurationMinutes": sleep,
        "submittedReportCount": len(past),
        "sampleDays": len(reports),
        "hasSufficientHistory": sufficient,
    }
    signals = []
    if current is None or current.status != "submitted":
        signals.append(
            signal(
                "REPORT_MISSING",
                "OBSERVE",
                "Report not received" if current is None else "Report in draft",
                f"No Sādhanā report has been submitted for today ({today})."
                if current is None
                else "Sādhanā report started but not yet submitted for today.",
                student_id,
                "Missing today" if current is None else "Draft pending",
            )
        )
    missing = 0
    cursor = date.fromisoformat(today)
    if past:
        for offset in range(1, 31):
            target = (cursor - timedelta(days=offset)).isoformat()
            found = next((r for r in reports if r.practice_date == target and r.status == "submitted"), None)
            if found:
                break
            missing += 1
        if missing >= 3:
            signals.append(signal("REPEATED_REPORT_MISSING", "FOLLOW_UP_SUGGESTED", "Reporting pattern changed", f"No report has been received for {missing} consecutive days.", student_id, f"{missing} days missing"))
        elif missing >= 2:
            signals.append(signal("REPEATED_REPORT_MISSING", "OBSERVE", "Reporting pattern changed", f"No report received for {missing} consecutive days.", student_id, f"{missing} days missing"))

    if current and current.status == "submitted" and sufficient:
        def deviation(kind, current_value, base, observe, follow, title, dim):
            if base is None or current_value is None or base == 0:
                return
            drop = base - current_value
            pct = (drop / base) * 100
            if drop > 0 and pct >= follow:
                signals.append(signal(kind, "FOLLOW_UP_SUGGESTED", title, "Current value is significantly below personal baseline.", student_id, metadata={"currentValue": current_value, "baselineValue": base, "deviationPercent": round(pct)}, dimension=dim))
            elif drop > 0 and pct >= observe:
                signals.append(signal(kind, "OBSERVE", title, "Current value is below personal baseline.", student_id, metadata={"currentValue": current_value, "baselineValue": base, "deviationPercent": round(pct)}, dimension=dim))

        if current.total_rounds is not None:
            deviation("JAPA_CHANGE", current.total_rounds, rounds if rounds and rounds >= 4 else None, 20, 40, "Japa pattern changed", "japa")
        if wake is not None and current.wake_up_time:
            diff = (time_minutes(current.wake_up_time) or 0) - wake
            if diff >= 75:
                signals.append(signal("WAKE_TIME_CHANGE", "FOLLOW_UP_SUGGESTED", "Wake-up pattern shifted", "Woke up later than personal baseline.", student_id, dimension="wake_up"))
            elif diff >= 30:
                signals.append(signal("WAKE_TIME_CHANGE", "OBSERVE", "Wake-up pattern shifted", "Woke up later than personal baseline.", student_id, dimension="wake_up"))
        if sleep and sleep > 0 and current.sleep_duration_minutes is not None:
            pct = abs(current.sleep_duration_minutes - sleep) / sleep * 100
            if pct >= 35:
                signals.append(signal("SLEEP_PATTERN_CHANGE", "OBSERVE", "Sleep duration changed", "Sleep duration differs significantly from personal baseline.", student_id, dimension="sleep"))
        if waste is not None and current.time_wasted_duration_minutes is not None:
            if current.time_wasted_duration_minutes - waste >= 60:
                signals.append(signal("TIME_WASTE_INCREASE", "FOLLOW_UP_SUGGESTED", "Unused time increased", "Reported unused time is higher than personal baseline.", student_id, dimension="time_waste"))
            elif current.time_wasted_duration_minutes - waste >= 30:
                signals.append(signal("TIME_WASTE_INCREASE", "OBSERVE", "Unused time increased", "Reported unused time is higher than personal baseline.", student_id, dimension="time_waste"))
        for kind, value, base, dim in (
            ("READING_REDUCTION", current.reading_duration_minutes, reading, "reading"),
            ("ACTIVITY_REDUCTION", current.hearing_duration_minutes, hearing, "hearing"),
            ("ACTIVITY_REDUCTION", current.total_study_duration_minutes, study, "study"),
        ):
            if base and base >= 20 and value is not None and value < base:
                pct = (base - value) / base * 100
                level = "OBSERVE" if pct >= 40 else None
                if pct >= 60:
                    level = "FOLLOW_UP_SUGGESTED"
                if value == 0 or level:
                    signals.append(signal(kind, level or "OBSERVE", "Routine activity changed", "Activity duration is below personal baseline.", student_id, dimension=dim))

    dimensions = {s["dimension"] for s in signals if s["dimension"] != "reporting"}
    if len(dimensions) >= 3:
        signals.append(signal("ROUTINE_CHANGE", "FOLLOW_UP_SUGGESTED", "Routine pattern changed", "Several activity patterns have changed simultaneously compared with personal baseline.", student_id, dimension="reporting"))
    elif len(dimensions) >= 2:
        signals.append(signal("ROUTINE_CHANGE", "OBSERVE", "Routine pattern changed", "Multiple activity patterns have changed compared with personal baseline.", student_id, dimension="reporting"))

    priority = {"FOLLOW_UP_SUGGESTED": 0, "OBSERVE": 1, "STABLE": 2}
    signals.sort(key=lambda item: priority[item["level"]])
    level = signals[0]["level"] if signals else "STABLE"
    if level == "STABLE":
        headline = "Establishing Baseline" if not sufficient else "Consistent Routine"
        detail = "Initial reporting in progress. Baseline will establish after 5 submitted reports." if not sufficient else "Reporting and Sādhanā patterns appear consistent with recent personal baseline."
    elif len(dimensions) >= 2:
        headline = "Routine pattern changed"
        detail = "Several activity patterns have changed compared with the recent personal pattern." if len(dimensions) >= 3 else "Multiple activity patterns have changed compared with the recent personal pattern."
    else:
        headline = signals[0]["title"]
        detail = signals[0]["reason"]

    return {
        "level": level,
        "signals": signals,
        "primarySignal": signals[0] if signals else None,
        "additionalCount": max(0, len(signals) - 1),
        "summaryHeadline": headline,
        "summaryDetail": detail,
        "baseline": baseline,
        "consecutiveMissingDays": missing,
        "reportingConsistencyRatio": f"{sum(1 for r in reports if r.status == 'submitted' and r.practice_date >= (cursor-timedelta(days=7)).isoformat())}/7",
    }
