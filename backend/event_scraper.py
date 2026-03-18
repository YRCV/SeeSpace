import os
import requests
from dotenv import load_dotenv
from utils import parse_location

load_dotenv()

API_URL = os.getenv("NJIT_EVENTS_URL")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}

def fetch_events_data():
    response = requests.get(API_URL, headers=HEADERS)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"\033[91mFailed to fetch events. Status code: {response.status_code}\033[0m")
        return []

def parse_event(event):
    name = event.get("title", "Unknown")
    location = event.get("location", "TBA")
    start_time = event.get("startDateTime")
    end_time = event.get("endDateTime")
    
    building, rooms = parse_location(location)
    
    return [
        {
            "name": name,
            "building": building,
            "room": room,
            "start_time": start_time,
            "end_time": end_time,
        }
        for room in rooms
    ]

def fetch_all_events():
    all_events = []

    print(f"\033[94mFetching all events...\033[0m")

    data = fetch_events_data()
    for event in data:
        records = parse_event(event)
        all_events.extend(records)
        for record in records:
            print(record)
    
    print(f"\033[92mFetched {len(data)} events.\033[0m")
    return all_events

if __name__ == "__main__":
    fetch_all_events()