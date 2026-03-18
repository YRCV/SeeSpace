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
    
def unroll_course_schedule(course_name, location, days, start_24h, end_24h):
    # generate an array of event dictionaries with ISO time format for every class meeting of the semester
    
    # map days
    target_days = [RRULE_MAP[day] for day in days.upper() if day in RRULE_MAP]

    if not target_days or not start_24h or not end_24h:
        return []

    # parse time
    start_h, start_m, start_s = map(int, start_24h.split(":"))
    end_h, end_m, end_s = map(int, end_24h.split(":"))

    # setup naive datetime
    dt_start_naive = SEMESTER_START.replace(hour=start_h, minute=start_m, second=start_s, tzinfo=NJ_TIMEZONE)
    dt_end_naive = SEMESTER_END.replace(hour=end_h, minute=end_m, second=end_s, tzinfo=NJ_TIMEZONE)

    # generate all occurences in the range of the semester
    occurences = list(rrule.rrule(
        rrule.WEEKLY,
        byweekday=target_days,
        dtstart=dt_start_naive,
        until=dt_end_naive,
    ))

    # extract the building and room only once
    building, room = parse_location(location)

    unrolled_classes = []
    for dt_naive in occurences:
        start_aware = dt_naive.astimezone(NJ_TIMEZONE)
        end_aware = dt_naive.astimezone(NJ_TIMEZONE).replace(hour=end_h, minute=end_m, second=end_s)
        
        unrolled_classes.append({
            "course": course_name,
            "building": building,
            "room": room,
            "start_time": start_aware.isoformat(),
            "end_time": end_aware.isoformat(),
        })

    return unrolled_classes

if __name__ == "__main__":
    print(normalize_course_time("10:00 AM - 12:30 PM"))