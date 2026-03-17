import os
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from utils import unroll_course_schedule, normalize_course_time, parse_location

load_dotenv()

API_URL = os.getenv("NJIT_SECTIONS_API")

SUBJECTS = [
    "ECE","ACCT", "AD", "ARCH", "AS", "BDS", "BIOL", "BME", "BMET", "BNFO", "CE", 
    "CET", "CHE", "CHEM", "CIM", "CMT", "COM", "CS", "DD", "DS", "ECE", 
    "ECET", "ECON", "EM", "ENE", "ENGL", "ENGR", "ENTR", "EPS", "ESC", "ET", 
    "EVSC", "FED", "FIN", "FRSC", "FYS", "GSND", "HIST", "HRM", "HSS", "ID", 
    "IE", "IET", "INT", "INTD", "IS", "IT", "LIT", "MARC", "MATH", "MBGC", 
    "ME", "MECH", "MET", "MGMT", "MIS", "MNE", "MNET", "MR", "MRKT", "MTEN", 
    "MTH", "MTSE", "NEUR", "OM", "OPSE", "PE", "PHB", "PHEN", "PHIL", "PHPY", 
    "PHY", "PHYS", "PSY", "PTC", "RBHS", "SDET", "SET", "STS", "THTR", "TRAN",
    "TUTR", "UMD", "USYS", "YWCC"
]

def fetch_all_sections():
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    all_classes = []

    for subject in SUBJECTS:
        print(f"\033[94mFetching {subject} courses...\033[0m")

        query_params = {
        "term": "202610",
        "offset": "0",
        "max": "999",
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
                print(f"\033[91mFailed to fetch {subject} courses.\033[0m")
                continue

            soup = BeautifulSoup(html_content, "html.parser")
            tables = soup.find_all('table', class_="sections-table")

            for table in tables:
                course_header = table.find_previous('h4')
                raw_course_name = course_header.text.strip() if course_header else "Unknown"

                for row in table.find_all('tr'):
                    cols = row.find_all('td')
                    
                    if not cols:
                        continue

                    raw_status = cols[5].get_text(strip=True)
                    if raw_status == "Cancelled":
                        continue

                    raw_days = cols[2].get_text(strip=True)
                    raw_time = cols[3].get_text(strip=True)
                    raw_location = cols[4].get_text(strip=True)

                    if raw_location == "TBA" or raw_location == "":
                        continue

                    if raw_time == "TBA":
                        continue

                    days_list = list(cols[2].stripped_strings)
                    times_list = list(cols[3].stripped_strings)
                    locations_list = list(cols[4].stripped_strings)

                    if not raw_location or "TBA" in raw_location or raw_status == "Canceled":
                        continue
                    if not (len(days_list) == len(times_list) == len(locations_list)):
                        print(f"\033[93mWarning: Mismatched schedule for {raw_course_name}\033[0m")
                    
                    for raw_days, raw_time, raw_location in zip(days_list, times_list, locations_list):
                        if not raw_location or "TBA" in raw_location:
                            continue

                        start_time, end_time = normalize_course_time(raw_time)
                        if not start_time or not end_time:
                            continue

                        building, room = parse_location(raw_location)
                    
                        course_data = {
                            "course_name": raw_course_name,
                            "days": raw_days,
                            "start_time": start_time,
                            "end_time": end_time,
                            "building": building,
                            "room": room,
                        }

                        all_classes.append(course_data)
                        print(course_data)
                        #print(f"Found {course_code} at {location} on {days} at {class_time}")
        else:
            print(f"\033[91mFailed to fetch {subject} courses. Status code: {response.status_code}\033[0m")
        time.sleep(2)

    print(f"\n \033[92mScraping completed. Total classes: {len(all_classes)}\033[0m")
    return all_classes

if __name__ == "__main__":
    fetch_all_sections()