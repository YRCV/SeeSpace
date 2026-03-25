import os
import json
from course_scraper import fetch_all_sections
from event_scraper import fetch_all_events
from utils import unroll_course_schedule, normalize_event_time

os.makedirs("data", exist_ok=True)

print("\033[44m\033[1mPipeline started\033[0m")

# scrape courses
print("\033[1m\033[93mFetching course data...\033[0m")
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
print(f"\033[1m\033[92mProcessed all courses: {len(course_occurrences)}\n\033[0m")

# scrape events
print("\033[1m\033[93mFetching event data...\033[0m")
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
print(f"\033[1m\033[92mProcessed all events: {len(event_occurences)}\n\033[0m")

all_occurrences = course_occurrences + event_occurences
print(f"\033[44m\033[1mTotal occurrences: {len(all_occurrences)}\033[0m")
print("\033[1m\033[93m\nSaving data...\033[0m")
with open("data/all_occurrences.json", "w") as f:
    json.dump(all_occurrences, f, indent=2)

print("\033[42m\033[1mPipeline completed\033[0m")