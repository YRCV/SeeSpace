import os
import json
from course_scraper import fetch_all_sections
from event_scraper import fetch_all_events
from utils import unroll_course_schedule, normalize_event_time

os.makedirs("data", exist_ok=True)

# scrape courses
raw_sections = fetch_all_sections()

course_occurrences = []
for section in raw_sections:
    course_occurrences.extend(unroll_course_schedule(
        course_name=section["course_name"],
        building=section["building"],
        room=section["room"],
        days=section["days"],
        start_24h=section["start_time"],
        end_24h=section["end_time"]
    ))

# scrape events
raw_events = fetch_all_events()

event_occurences = []

for event in raw_events:
    event_occurences.append({
        "title": event["name"],
        "building": event["building"],
        "room": event["room"],
        "start_time": normalize_event_time(event["start_time"]),
        "end_time": normalize_event_time(event["end_time"]),
        "type": "event"
    })

all_occurrences = course_occurrences + event_occurences

with open("data/all_occurrences.json", "w") as f:
    json.dump(all_occurrences, f, indent=2)