from datetime import datetime
from zoneinfo import ZoneInfo
from dateutil import rrule

RRULE_MAP = {
    'M': rrule.MO,
    'T': rrule.TU,
    'W': rrule.WE,
    'R': rrule.TH,
    'F': rrule.FR,
    'S': rrule.SA,
    'U': rrule.SU
}

SEMESTER_START = datetime(2026, 1, 20)
SEMESTER_END = datetime(2026, 5, 5)
NJ_TIMEZONE = ZoneInfo("America/New_York")

def normalize_course_time(raw_time_string):
    if not raw_time_string or "TBA" in raw_time_string:
        return None, None
    
    parts = raw_time_string.strip().split("-")
    if len(parts) != 2:
        return None, None

    start_str = parts[0].strip()
    end_str = parts[1].strip()

    try:
        start_dt = datetime.strptime(start_str, "%I:%M %p")
        end_dt = datetime.strptime(end_str, "%I:%M %p")
        return start_dt.strftime("%H:%M:%S"), end_dt.strftime("%H:%M:%S")
    except ValueError:
        return None, None

if __name__ == "__main__":
    print(normalize_course_time("01:00 AM - 12:30 PM"))