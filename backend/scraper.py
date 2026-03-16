import os
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("NJIT_SECTIONS_API")

SUBJECTS = ["AD", "MATH", "ECE"]

def fetch_all_sections():
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    all_classes = []

    for subject in SUBJECTS:
        print(f"Fetching {subject} courses...")

        query_params = {
        "term": "202610",
        "offset": "0",
        "max": "500",
        "subject": subject,
        }

        response = requests.get(API_URL, params=query_params, headers=headers)

        if response.status_code == 200:
            data=response.json()
            
            if isinstance(data, list) and len(data) > 0:
                html_content = data[0].get("SECTIONS_TABLE", "")
            else:
                html_content = ""

            if not html_content:
                print(f"Failed to fetch {subject} courses.")
                continue

            soup = BeautifulSoup(html_content, "html.parser")
            tables = soup.find_all('table', class_="sections-table")

            for table in tables:
                course_header = table.find_previous('h4')
                course_code = course_header.text.strip() if course_header else "Unknown"

                for row in table.find_all('tr'):
                    cols = row.find_all('td')
                    
                    if not cols:
                        continue
                    days = cols[2].get_text(separator=" ").strip()
                    class_time = cols[3].get_text(separator=" ").strip()
                    location = cols[4].get_text(separator=" ").strip()
                    status = cols[5].get_text(strip=True)
                    
                    if not location or "TBA" in location or status == "Canceled":
                        continue
                    
                    course_data = {
                        "course": course_code,
                        "days": days,
                        "time": class_time,
                        "location": location,
                    }

                    all_classes.append(course_data)
                    print(f"Found {course_code} at {location} on {days} at {class_time}")
        else:
            print(f"Failed to fetch {subject} courses. Status code: {response.status_code}")
        time.sleep(2)

    print(f"\n Scraping completed. Total classes: {len(all_classes)}")
    return all_classes

if __name__ == "__main__":
    fetch_all_sections()