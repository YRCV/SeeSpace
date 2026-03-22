# Implementation Plan - Calendar Upgrade

Upgrade the classroom schedule calendar to support a 6 AM to 3 AM time range, continuous event/free blocks, and granular timing (any minute).

## Proposed Changes

### Frontend Components

#### [MODIFY] [ClassroomCalendar.tsx](file:///d:/Projects/SeeSpace/frontend/components/ClassroomCalendar.tsx)

- **Constants**:
    - Define `START_HOUR = 6` (6 AM).
    - Define `END_HOUR = 27` (3 AM next day).
    - Define `HOUR_HEIGHT = 40` (adjustable for UI).
- **Data Processing**:
    - Implement `processScheduleForDay(dayDate: Date, schedule: ScheduleEntry[])`:
        - Filters events that fall within the [6am, 3am next day] window.
        - Merges adjacent events with the same title.
        - Identifies "free" gaps between events and creates "free" blocks.
        - Returns a list of `CalendarBlock` (either `occupied` or `free`) with `startMinutes` and `durationMinutes`.
- **Rendering**:
    - Update `dayColumn` to be a relative container (`height: TOTAL_HOURS * HOUR_HEIGHT`).
    - Map through processed `CalendarBlock`s and render them using absolute positioning:
        - `top: (startMinutes / 60) * HOUR_HEIGHT`
        - `height: (durationMinutes / 60) * HOUR_HEIGHT`
    - Update the `timeColumn` to show labels from 06:00 to 03:00.
    - Ensure the visual style (colors, borders, selected state) is preserved.

## Verification Plan

### Manual Verification
- **Time Range**: Verify the calendar scroll or view starts at 06:00 and ends at 03:00.
- **Continuous Blocks**: Check if a 2-hour class appears as one long block instead of two 1-hour blocks.
- **Granular Timing**: Check if an event starting at 10:15 starts slightly below the 10:00 mark.
- **Free Blocks**: Verify that gaps between classes are filled with the "Free" style (light green) and are also continuous.
- **Selection**: Ensure clicking an occupied block still shows the correct info box at the bottom.
