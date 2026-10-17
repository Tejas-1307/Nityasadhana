from datetime import date, datetime, timedelta, timezone, tzinfo
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

DEFAULT_TZ = "Asia/Kolkata"
IST = timezone(timedelta(hours=5, minutes=30))


def get_timezone(tz: str | None = None) -> tzinfo:
    name = (tz or DEFAULT_TZ).strip()
    try:
        return ZoneInfo(name)
    except (ZoneInfoNotFoundError, Exception):
        pass
    if name in ("Asia/Kolkata", "Asia/Calcutta", "IST") or "kolkata" in name.lower() or "calcutta" in name.lower():
        return IST
    return timezone.utc


def today_date(tz: str | None = None) -> date:
    return datetime.now(get_timezone(tz)).date()


def today_str(tz: str | None = None) -> str:
    return today_date(tz).isoformat()
