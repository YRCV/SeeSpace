import os
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from utils import unroll_course_schedule, normalize_course_time, parse_location

load_dotenv()

API_URL = os.getenv("NJIT_SECTIONS_API")

SUBJECTS = [
    "ACCT", "AD", "ARCH", "AS", "BDS", "BIOL", "BME", "BMET", "BNFO", "CE", 
    "CET", "CHE", "CHEM", "CIM", "CMT", "COM", "CS", "DD", "DS", "ECE", 
    "ECET", "ECON", "EM", "ENE", "ENGL", "ENGR", "ENTR", "EPS", "ESC", "ET", 
    "EVSC", "FED", "FIN", "FRSC", "FYS", "GSND", "HIST", "HRM", "HSS", "ID", 
    "IE", "IET", "INT", "INTD", "IS", "IT", "LIT", "MARC", "MATH", "MBGC", 
    "ME", "MECH", "MET", "MGMT", "MIS", "MNE", "MNET", "MR", "MRKT", "MTEN", 
    "MTH", "MTSE", "NEUR", "OM", "OPSE", "PE", "PHB", "PHEN", "PHIL", "PHPY", 
    "PHY", "PHYS", "PSY", "PTC", "RBHS", "SDET", "SET", "STS", "THTR", "TRAN",
    "TUTR", "UMD", "USYS", "YWCC"
]

def extract_parallel_data(cell):
    if not cell:
        return []

    raw_text = cell.get_text(separator="|")
    return [item.strip() if item.strip() else "TBA" for item in raw_text.split("|")]
    
def fetch_subject_html(subject):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

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
    return html_content

def extract_course_sections(raw_course_name, cols):
    sections = []

    raw_status = cols[5].get_text(strip=True)
    if raw_status == "Cancelled":
        return sections

    days_list = extract_parallel_data(cols[2])
    times_list = extract_parallel_data(cols[3])
    locations_list = extract_parallel_data(cols[4])

    max_len = max(len(days_list), len(times_list), len(locations_list))
    days_list += ["TBA"] * (max_len - len(days_list))
    times_list += ["TBA"] * (max_len - len(times_list))
    locations_list += ["TBA"] * (max_len - len(locations_list))

    for raw_days, raw_time, raw_location in zip(days_list, times_list, locations_list):
        if raw_location == "TBA":
            continue

        start_time, end_time = normalize_course_time(raw_time)
        if not start_time or not end_time:
            continue

        building, rooms = parse_location(raw_location)
        room = rooms[0] if rooms else "TBA"  # course sections are always a single room
    
        course_data = {
            "course_name": raw_course_name,
            "days": raw_days,
            "start_time": start_time,
            "end_time": end_time,
            "building": building,
            "room": room,
        }

        sections.append(course_data)
        print(course_data)
        #print(f"Found {course_code} at {location} on {days} at {class_time}")
    return sections

def fetch_all_sections():
    all_classes = []

    for subject in SUBJECTS:
        print(f"\033[94mFetching {subject} courses...\033[0m")

        html_content = fetch_subject_html(subject)
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
                    
                    sections = extract_course_sections(raw_course_name, cols)
                    all_classes.extend(sections)
        time.sleep(2)

    print(f"\n \033[92mScraping completed. Total classes: {len(all_classes)}\033[0m")
    return all_classes

if __name__ == "__main__":
    fetch_all_sections()