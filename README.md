# SeeSpace

Free space finder app for our campus. Collecting classroom data to show estimated free time periods.

## Technology Stack

- **Framework**: React Native with Expo SDK 55
- **Language**: TypeScript

## Features

- Search for specific classrooms (fuzzy matching).
- Room status indicators (Free/Occupied).
- Categorization by building.
- 2-week calendar view for each classroom.
- Swipeable tabs for seamless navigation.

## Colors

- **Primary**: `#d64045`
- **Secondary**: `#2a2b2a`
- **Tertiary**: `#dcdcdd`

## Data Source

Building and room listings are defined in `frontend/constants/data.ts`. The 2-week classroom calendar grid is dynamically populated using occupancy data from `frontend/assets/data/all_occurrences.json` through the `scheduleData.ts` utility.
