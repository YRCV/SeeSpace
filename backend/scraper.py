import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("NJIT_COURSES_API")
query_params = {
    "Mzc=dGVybQ==": "MQ==MjAyNjEw",      # term
    "NDM=b2Zmc2V0": "Mzg=MA==",          # offset
    "NTk=bWF4": "NjA=MTAw",              # max
    "ODE=c3ViamVjdA==": "Mjc=QUQ=",      # subject
    "encoded": "true"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}

def fetch_ad_courses():
    print("Fetching AD courses...")
    response = requests.get(API_URL, params=query_params, headers=headers)
    print(response.json())

    if response.status_code == 200:
        data=response.json()
        print("Successfully fetched AD courses:")
        
        for course in data:
            print(course.get('COURSE', 'Unknown Course'))
    else:
        print(f"Failed. Status code: {response.status_code}")

if __name__ == "__main__":
    fetch_ad_courses()