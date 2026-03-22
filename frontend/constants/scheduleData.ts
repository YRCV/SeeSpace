// This file is auto-generated from all_occurrences.json
import RAW_DATA from '../assets/data/all_occurrences.json';

export interface ScheduleEntry {
  title: string;
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
  type: 'course' | 'event';
  building: string;
  room: string;
}

// Map the raw data to our ScheduleEntry interface
export const RAW_SCHEDULE_DATA: ScheduleEntry[] = (RAW_DATA as any[]).map(item => ({
  title: item.title,
  startTime: item.start_time,
  endTime: item.end_time,
  type: item.type as 'course' | 'event',
  building: item.building,
  room: item.room
}));

export const BUILDING_DISPLAY_NAMES: Record<string, string> = {
  'WEST': 'Weston Hall',
  'FMH': 'Fenster Hall',
  'TIER': 'Tiernan Hall',
  'ECEC': 'Electrical & Computer Engineering Center',
  'KUPF': 'Kupfrian Hall',
  'GITC': 'Guttenberg Information Technologies Center',
  'CKB': 'Campus Center',
  'CC': 'Campus Center',
  'CULM': 'Cullimore Hall',
  'EBER': 'Eberhardt Hall',
  'Bloom': 'Wellness & Events Center',
  'Math': 'Math Building',
  'Upper': 'Upper Green',
  'IT': 'IT Building',
  'FENS': 'Fenster Hall',
};

export const BUILDING_DISTANCES: Record<string, string> = {
  'WEST': '3 mins away',
  'FMH': '5 mins away',
  'TIER': '4 mins away',
  'ECEC': '6 mins away',
  'KUPF': '5 mins away',
  'GITC': '7 mins away',
  'CKB': '2 mins away',
  'CC': '2 mins away',
  'CULM': '4 mins away',
  'EBER': '8 mins away',
  'Bloom': '10 mins away',
  'Math': '6 mins away',
  'Upper': '1 min away',
  'IT': '7 mins away',
  'FENS': '5 mins away',
};

// Helper to get current status based on schedule
export function getRoomStatus(schedule: ScheduleEntry[]): 'Free' | 'Busy' {
  const now = new Date();
  
  for (const entry of schedule) {
    const start = new Date(entry.startTime);
    const end = new Date(entry.endTime);
    
    if (now >= start && now < end) {
      return 'Busy';
    }
  }
  
  return 'Free';
}

// Helper to get schedule for a specific room
export function getRoomSchedule(buildingCode: string, roomName: string): ScheduleEntry[] {
  return RAW_SCHEDULE_DATA.filter(entry => 
    entry.building === buildingCode && entry.room === roomName
  );
}
