import os
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("NJIT_EVENTS_URL")

def fetch_all_events():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    all_events = []

    print(f"\033[94mFetching all events...\033[0m")

    response = requests.get(API_URL, headers=headers)

    if response.status_code == 200:
        data=response.json()
        print("\033[92mConnection successful\033[0m")
        for event in data:
            name = event.get("title")
            location = event.get("location")
            start_time = event.get("startDateTime")
            end_time = event.get("endDateTime")

            event_data = {
                "name": name,
                "location": location,
                "start_time": start_time,
                "end_time": end_time
            }

            all_events.append(event_data)
            print(f"\033[94m-\033[0m {name} | {location} | {start_time} - {end_time}")
    else:
        print(f"\033[91mFailed to fetch events. Status code: {response.status_code}\033[0m")
    
    print(f"\033[92mFetched {len(all_events)} events.\033[0m")
    return all_events

if __name__ == "__main__":
    fetch_all_events()

