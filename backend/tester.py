import utils

location_examples = [
    "CKB 116",
    "Central King Building Classroom 204",
    "CKB 317 Classroom",
    "Faculty Memorial Hall Classroom 409",
    "GITC Robotics Lab Room 2311",
    "Campus Center Ballroom A",
    "Kupfrian Smartcart Classroom 203",
    "Electrical and Computer Engineering Center 202",
    "Tiernan Hall Lecture Hall 2",
    "Cullimore Hall Classroom 110",
    "ME 224",
    "GITC 1100",
    "Campus Center Highlander Pub",
    "CKB Agile Strategy Lab",
    "CTR 130 Campus Center Atrium",
    "Campus Center Lobby",
    "Faculty Memorial Hall Smart Classroom 408",
    "Campus Center Ballroom &quot;A&quot;"
]

def test_parse_location():
    print(f"{'RAW STRING':<50} | {'BUILDING':<10} | {'ROOM'}")
    print("-" * 80)
    
    for case in location_examples:
        building, room = utils.parse_location(case)
        print(f"{case:<50} | {building:<10} | {room}")

courses_examples = [
    {
        "course_name": "ACCT 2110",
        "location": "CKB 116",
        "days": "MWF",
        "time": "10:00 AM - 11:15 AM",
    },
    {
        "course_name": "ACCT 2110",
        "location": "CKB 118",
        "days": "MWF",
        "time": "10:00 AM - 11:15 AM",
        "location": "CKB 118",
    },
    {
        "course_name": "ECE 271",
        "days": "F",
        "time": "06:00 PM - 10:00 PM",
        "location": "KUPF 205",
    }
]

def test_unroll():
    for course in courses_examples:
        course["start_24h"], course["end_24h"] = utils.normalize_course_time(course["time"])
        course.pop("time", None)
        print(course)
        print("\n")
        print(utils.unroll_course_schedule(**course))

if __name__ == "__main__":
    print("What would you like to test?\n1. Parse Location\n2. Unroll Course Schedule\n3. Both")
    input = input()
    if input == "1":
        print("\n")
        test_parse_location()
    elif input == "2":
        print("\n")
        test_unroll()
    elif input == "3":
        print("\n")
        test_parse_location()
        print("\n")
        test_unroll()
    
    