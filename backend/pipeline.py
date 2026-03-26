import os
from dotenv import load_dotenv
from supabase import create_client, Client
from course_scraper import fetch_all_sections
from event_scraper import fetch_all_events

load_dotenv()
url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_KEY", "")

if not url or not key:
    print("\033[41m\033[1mMissing SUPABASE_URL or SUPABASE_KEY in .env file\033[0m")
    exit(1)

supabase: Client = create_client(url, key)

print("\033[44m\033[1mPipeline started\033[0m")

# scrape courses
print("\033[1m\033[93mFetching course data...\033[0m")
course_sections = fetch_all_sections()
print(f"\033[1m\033[92mProcessed all courses: {len(course_sections)}\n\033[0m")

# deduplicate courses
unique_courses = []
seen_courses = set()
for c in course_sections:
    fprint = (c.get("course_name"), c.get("days"), c.get("start_time"), c.get("room"))
    if fprint not in seen_courses:
        seen_courses.add(fprint)
        unique_courses.append(c)

# push courses to Supabase
if unique_courses:
    print(f"\033[1m\033[93mUploading {len(unique_courses)} unique courses to Supabase...\033[0m")
    try:
        response = supabase.table("course_sections").upsert(unique_courses, on_conflict="course_name,days,start_time,room").execute()
        print(f"\033[1m\033[92mUploaded {len(response.data) if hasattr(response, 'data') else 'multiple'} courses successfully.\n\033[0m")
    except Exception as e:
        print(f"\033[1m\033[91mFailed to upload courses: {e}\n\033[0m")

# scrape events
print("\033[1m\033[93mFetching event data...\033[0m")
events = fetch_all_events()
print(f"\033[1m\033[92mProcessed all events: {len(events)}\n\033[0m")

# deduplicate events
unique_events = []
seen_events = set()
for e in events:
    fprint = (e.get("event_name"), e.get("event_date"), e.get("start_time"), e.get("room"))
    if fprint not in seen_events:
        seen_events.add(fprint)
        unique_events.append(e)

# push events to Supabase
if unique_events:
    print(f"\033[1m\033[93mUploading {len(unique_events)} unique events to Supabase...\033[0m")
    try:
        response = supabase.table("events").upsert(unique_events, on_conflict="event_name,event_date,start_time,room").execute()
        print(f"\033[1m\033[92mUploaded {len(response.data) if hasattr(response, 'data') else 'multiple'} events successfully.\n\033[0m")
    except Exception as e:
        print(f"\033[1m\033[91mFailed to upload events: {e}\n\033[0m")

print("\033[42m\033[1mPipeline completed\033[0m")