export interface Classroom {
  id: string;
  name: string;
  building: string;
  status: 'free' | 'occupied';
  distance?: string;
  isFavorite?: boolean;
}

export interface Building {
  id: string;
  name: string;
  rooms: Classroom[];
}

export const BUILDINGS: Building[] = [
  {
    id: 'b1',
    name: 'Science Hall',
    rooms: [
      { id: 'r101', name: 'Room 101', building: 'Science Hall', status: 'free', distance: '2 mins away' },
      { id: 'r102', name: 'Room 102', building: 'Science Hall', status: 'occupied', distance: '3 mins away' },
      { id: 'r201', name: 'Room 201', building: 'Science Hall', status: 'free', distance: '5 mins away' },
    ],
  },
  {
    id: 'b2',
    name: 'Engineering Building',
    rooms: [
      { id: 'e101', name: 'Lab A', building: 'Engineering Building', status: 'free', distance: '8 mins away' },
      { id: 'e102', name: 'Lab B', building: 'Engineering Building', status: 'free', distance: '9 mins away' },
      { id: 'e201', name: 'Workshop 1', building: 'Engineering Building', status: 'occupied', distance: '10 mins away' },
    ],
  },
  {
    id: 'b3',
    name: 'Arts Center',
    rooms: [
      { id: 'a01', name: 'Studio 1', building: 'Arts Center', status: 'occupied', distance: '4 mins away' },
      { id: 'a02', name: 'Studio 2', building: 'Arts Center', status: 'free', distance: '5 mins away' },
    ],
  },
];

export const ALL_ROOMS: Classroom[] = BUILDINGS.flatMap(b => b.rooms);
