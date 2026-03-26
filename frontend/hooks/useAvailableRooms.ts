import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/utils/supabase';
import { ALL_ROOMS, Classroom } from '@/constants/data';

export function useAvailableRooms() {
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Poll Supabase exactly once on component mount to fetch rules
  useEffect(() => {
    async function fetchData() {
      const { data: coursesData, error: coursesError } = await supabase
        .from('course_sections')
        .select('*');
        
      if (coursesError) console.error("Error fetching courses:", coursesError);

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*');
        
      if (eventsError) console.error("Error fetching events:", eventsError);

      if (coursesData) setCourses(coursesData);
      if (eventsData) setEvents(eventsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const [now, setNow] = useState(new Date());
  
  // Tick every minute so the UI dynamically updates if a class just started/ended
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // CPU rendering: instantly match the downloaded rules against the current Date
  const roomsWithStatus = useMemo(() => {
    if (loading) return ALL_ROOMS;

    const dayMap = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
    const currentDayStr = dayMap[now.getDay()];
    const currentDateStr = now.toISOString().split('T')[0];
    const currentHourStr = now.toLocaleTimeString('en-GB', { hour12: false }); // e.g. "14:30:00"

    const isTimeInBetween = (start: string, end: string, check: string) => {
      // handles checking pure time strings like 12:00:00 <= 14:30:00
      return check >= start && check <= end;
    };

    return ALL_ROOMS.map(room => {
      const occupiedByCourse = courses.some(c => 
        c.building === room.building &&
        c.room === room.name &&
        c.days.includes(currentDayStr) &&
        c.start_time && c.end_time &&
        isTimeInBetween(c.start_time, c.end_time, currentHourStr)
      );

      const occupiedByEvent = events.some(e =>
        e.building === room.building &&
        e.room === room.name &&
        e.event_date === currentDateStr &&
        e.start_time && e.end_time &&
        isTimeInBetween(e.start_time, e.end_time, currentHourStr)
      );

      return {
        ...room,
        status: (occupiedByCourse || occupiedByEvent) ? 'occupied' : 'free'
      } as Classroom;
    });
  }, [courses, events, loading, now]);

  return { rooms: roomsWithStatus, loading };
}
