from datetime import datetime
from zoneinfo import ZoneInfo
from dateutil import rrule
import re
import html

RRULE_MAP = {
    'M': rrule.MO,
    'T': rrule.TU,
    'W': rrule.WE,
    'R': rrule.TH,
    'F': rrule.FR,
    'S': rrule.SA,
    'U': rrule.SU
}

BUILDING_MAP = {
    "Campus Center": "CC",
    "Central King Building": "CKB",
    "Colton Hall": "COLT",
    "Cullimore Hall": "CULM",
    "Eberhardt Hall": "EBER",
    "Electrical and Computer Engineering Center": "ECEC",
    "Faculty Memorial Hall": "FMH",
    "Fenster Hall": "FENS",
    "Guttenberg Information Technologies Center": "GITC",
    "Kupfrian Hall": "KUPF",
    "Kupfrian": "KUPF",
    "Mechanical Engineering Center": "ME",
    "Tiernan Hall": "TIER",
    "Weston Hall": "WEST"
}

BUILDING_CODES = list(BUILDING_MAP.values())

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

def clean_room_string(room_str):
    fluff = ["Classroom", "converged", "Lab", "room"]
    for word in fluff:
        room_str = re.sub(fr"\b{word}\b", "", room_str, flags=re.IGNORECASE)

    room_str = re.sub(r'[,./\-"\']', ' ', room_str)
    return " ".join(room_str.split()).strip()

def parse_location(raw_location):
    if not raw_location:
        return "TBA", "TBA"
    
    clean_loc = " ".join(raw_location.split())

    for full_name, code in BUILDING_MAP.items():
        if full_name.lower() in clean_loc.lower():
            room_raw = re.sub(rf"{full_name}", "", clean_loc, flags=re.IGNORECASE)
            return code, clean_room_string(room_raw)
    
    for code in BUILDING_CODES:
        if re.search(rf"\b{code}\b", clean_loc, flags=re.IGNORECASE):
            room_raw = re.sub(rf"\b{code}\b", "", clean_loc, flags=re.IGNORECASE)
            return code, clean_room_string(room_raw)

    parts = clean_loc.split(" ", 1)
    if len(parts) == 2:
        return parts[0], clean_room_string(parts[1])
         
    return "OTHER", clean_loc
    
if __name__ == "__main__":
    print(normalize_course_time("01:00 AM - 12:30 PM"))