from datetime import datetime
from zoneinfo import ZoneInfo
from dateutil import rrule
import re
import html
import time

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
    if not raw_time_string or raw_time_string == "TBA":
        return None, None
    
    parts = raw_time_string.strip().split(" - ")
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

def normalize_event_datetime(raw_time_string):
    if not raw_time_string:
        return None, None
    
    dt = datetime.fromisoformat(raw_time_string)

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=NJ_TIMEZONE)  # stamp as ET, not convert

    event_date = dt.strftime("%Y-%m-%d")
    event_time = dt.strftime("%H:%M:%S")
    return event_date, event_time

def clean_room_string(room_str):
    room_str = html.unescape(room_str)
    room_str = room_str.replace('"', '').replace("'", "").replace('“', '').replace('”', '')

    fluff = ["Classroom", "smartcart", "smart", "converged", "Lab", "room", "Robotics"]
    for word in fluff:
        room_str = re.sub(fr"\b{word}\b", "", room_str, flags=re.IGNORECASE)

    room_str = re.sub(r'[,./\-"\']', ' ', room_str)
    return " ".join(room_str.split()).strip()

def split_rooms(cleaned_room):
    tokens = cleaned_room.split()
    if len(tokens) > 1 and all(t.isdigit() for t in tokens):
        return tokens
    return [cleaned_room]

def parse_location(raw_location):
    if not raw_location:
        return "TBA", ["TBA"]
    
    clean_loc = " ".join(raw_location.split())

    for full_name, code in BUILDING_MAP.items():
        if full_name.lower() in clean_loc.lower():
            room_raw = re.sub(rf"{full_name}", "", clean_loc, flags=re.IGNORECASE)
            return code, split_rooms(clean_room_string(room_raw))
    
    for code in BUILDING_CODES:
        if re.search(rf"\b{code}\b", clean_loc, flags=re.IGNORECASE):
            room_raw = re.sub(rf"\b{code}\b", "", clean_loc, flags=re.IGNORECASE)
            return code, split_rooms(clean_room_string(room_raw))

    parts = clean_loc.split(" ", 1)
    if len(parts) == 2:
        return parts[0], split_rooms(clean_room_string(parts[1]))
         
    return "OTHER", [clean_loc]

if __name__ == "__main__":
    pass