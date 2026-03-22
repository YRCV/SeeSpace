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
    "id": "b1",
    "name": "CKB",
    "rooms": [
      {
        "id": "b1_r0",
        "name": "28",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r1",
        "name": "32",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r2",
        "name": "45",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r3",
        "name": "106",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r4",
        "name": "114",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r5",
        "name": "116",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r6",
        "name": "116 G 08",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r7",
        "name": "120",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r8",
        "name": "124",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r9",
        "name": "126",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r10",
        "name": "204",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r11",
        "name": "207",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r12",
        "name": "212",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r13",
        "name": "214",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r14",
        "name": "215",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r15",
        "name": "217",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r16",
        "name": "220",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r17",
        "name": "222",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r18",
        "name": "223",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r19",
        "name": "226",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r20",
        "name": "303 Lecture Hall( learning techn)",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r21",
        "name": "310",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r22",
        "name": "314",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r23",
        "name": "317",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r24",
        "name": "330",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r25",
        "name": "341",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r26",
        "name": "Agile Strategy",
        "building": "CKB",
        "status": "free"
      },
      {
        "id": "b1_r27",
        "name": "G 08",
        "building": "CKB",
        "status": "free"
      }
    ]
  },
  {
    "id": "b2",
    "name": "KUPF",
    "rooms": [
      {
        "id": "b2_r0",
        "name": "103",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r1",
        "name": "104",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r2",
        "name": "105",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r3",
        "name": "106",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r4",
        "name": "107",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r5",
        "name": "108",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r6",
        "name": "117",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r7",
        "name": "118",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r8",
        "name": "202",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r9",
        "name": "202 208 209 Lecture Hall 210 CKB 106",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r10",
        "name": "203",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r11",
        "name": "204",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r12",
        "name": "205",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r13",
        "name": "205 Lecture Hall 210",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r14",
        "name": "205 Lecture Hall 211",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r15",
        "name": "206",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r16",
        "name": "207",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r17",
        "name": "209",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r18",
        "name": "211",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r19",
        "name": "Lecture Hall 117",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r20",
        "name": "Lecture Hall 118",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r21",
        "name": "Lecture Hall 210",
        "building": "KUPF",
        "status": "free"
      },
      {
        "id": "b2_r22",
        "name": "Lecture Hall 211",
        "building": "KUPF",
        "status": "free"
      }
    ]
  },
  {
    "id": "b3",
    "name": "CC",
    "rooms": [
      {
        "id": "b3_r0",
        "name": "Ballroom A",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r1",
        "name": "Ballroom A Ballroom B",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r2",
        "name": "Ballroom A Ballroom B Cafeteria 2nd Floor Lounge Conference 215 Conference 230 Conference 235 Conference 240 …",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r3",
        "name": "Ballroom A Ballroom B Cafeteria Conference 215 Conference 230 Conference 235 Conference 240 Conference …",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r4",
        "name": "Ballroom A Ballroom B CTR Ballroom",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r5",
        "name": "Ballroom A Ballroom B Gallery 2nd floor Conference 215 Conference 230 Conference 235 Conference 240 Conference…",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r6",
        "name": "Ballroom A Ballroom B Gallery 2nd floor Conference 215 Conference 230 Conference 235 Conference 240 CTR Ballroom CTR 130…",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r7",
        "name": "Ballroom B",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r8",
        "name": "Conference 215",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r9",
        "name": "Conference 215 Conference 220",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r10",
        "name": "Conference 220",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r11",
        "name": "Conference 225",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r12",
        "name": "Conference 230",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r13",
        "name": "Conference 230 Conference 220",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r14",
        "name": "Conference 230 Conference 235 Conference 225",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r15",
        "name": "Conference 235",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r16",
        "name": "Conference 240",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r17",
        "name": "CTR 130 Atrium",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r18",
        "name": "East Plaza Outside",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r19",
        "name": "Faculty Staff Dining Lounge",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r20",
        "name": "Gallery 2nd floor",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r21",
        "name": "Highlander Club",
        "building": "CC",
        "status": "free"
      },
      {
        "id": "b3_r22",
        "name": "Lobby",
        "building": "CC",
        "status": "free"
      }
    ]
  },
  {
    "id": "b4",
    "name": "FMH",
    "rooms": [
      {
        "id": "b4_r0",
        "name": "101C",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r1",
        "name": "108",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r2",
        "name": "109",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r3",
        "name": "110",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r4",
        "name": "203",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r5",
        "name": "204A",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r6",
        "name": "205",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r7",
        "name": "207",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r8",
        "name": "211",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r9",
        "name": "213",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r10",
        "name": "305",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r11",
        "name": "313",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r12",
        "name": "316",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r13",
        "name": "319",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r14",
        "name": "401C",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r15",
        "name": "404",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r16",
        "name": "405",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r17",
        "name": "407",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r18",
        "name": "408",
        "building": "FMH",
        "status": "free"
      },
      {
        "id": "b4_r19",
        "name": "409",
        "building": "FMH",
        "status": "free"
      }
    ]
  },
  {
    "id": "b5",
    "name": "GITC",
    "rooms": [
      {
        "id": "b5_r0",
        "name": "Lecture Hall 1100",
        "building": "GITC",
        "status": "free"
      },
      {
        "id": "b5_r1",
        "name": "Lecture Hall 1400",
        "building": "GITC",
        "status": "free"
      },
      {
        "id": "b5_r2",
        "name": "1100",
        "building": "GITC",
        "status": "free"
      },
      {
        "id": "b5_r3",
        "name": "1400",
        "building": "GITC",
        "status": "free"
      },
      {
        "id": "b5_r4",
        "name": "2311",
        "building": "GITC",
        "status": "free"
      },
      {
        "id": "b5_r5",
        "name": "2315A BYOD",
        "building": "GITC",
        "status": "free"
      }
    ]
  },
  {
    "id": "b6",
    "name": "TIER",
    "rooms": [
      {
        "id": "b6_r0",
        "name": "106",
        "building": "TIER",
        "status": "free"
      },
      {
        "id": "b6_r1",
        "name": "107",
        "building": "TIER",
        "status": "free"
      },
      {
        "id": "b6_r2",
        "name": "113",
        "building": "TIER",
        "status": "free"
      },
      {
        "id": "b6_r3",
        "name": "LECT 1",
        "building": "TIER",
        "status": "free"
      },
      {
        "id": "b6_r4",
        "name": "Lecture Hall 2",
        "building": "TIER",
        "status": "free"
      }
    ]
  },
  {
    "id": "b7",
    "name": "CULM",
    "rooms": [
      {
        "id": "b7_r0",
        "name": "CULM Lecture Hall 1 103 CULM Lecture Hall 2 104 110 111 GITC Lecture Hall 1100 Tiernan Lecture Hall 1 Tiernan Hall Lecture Hall 2 Kupfrian Lecture Hall 210 Kupfrian …",
        "building": "CULM",
        "status": "free"
      },
      {
        "id": "b7_r1",
        "name": "LECT 3",
        "building": "CULM",
        "status": "free"
      },
      {
        "id": "b7_r2",
        "name": "Lecture Hall 1 103",
        "building": "CULM",
        "status": "free"
      },
      {
        "id": "b7_r3",
        "name": "Lecture Hall 3 106",
        "building": "CULM",
        "status": "free"
      }
    ]
  },
  {
    "id": "b8",
    "name": "WEST",
    "rooms": [
      {
        "id": "b8_r0",
        "name": "HCAD Gallery 220",
        "building": "WEST",
        "status": "free"
      },
      {
        "id": "b8_r1",
        "name": "LECT 1",
        "building": "WEST",
        "status": "free"
      }
    ]
  },
  {
    "id": "b9",
    "name": "ECEC",
    "rooms": [
      {
        "id": "b9_r0",
        "name": "100",
        "building": "ECEC",
        "status": "free"
      },
      {
        "id": "b9_r1",
        "name": "115",
        "building": "ECEC",
        "status": "free"
      }
    ]
  },
  {
    "id": "b10",
    "name": "EBER",
    "rooms": [
      {
        "id": "b10_r0",
        "name": "112",
        "building": "EBER",
        "status": "free"
      }
    ]
  },
  {
    "id": "b11",
    "name": "Bloom",
    "rooms": [
      {
        "id": "b11_r0",
        "name": "Wellness and Events Marjorie A Perry Theater Bloom Wellness & Events Ctr Field Hospitality Suite (field view) Bloom Wellness and Events Ctr Turf Field",
        "building": "Bloom",
        "status": "free"
      }
    ]
  },
  {
    "id": "b12",
    "name": "Math",
    "rooms": [
      {
        "id": "b12_r0",
        "name": "Conference 611",
        "building": "Math",
        "status": "free"
      }
    ]
  },
  {
    "id": "b13",
    "name": "FENS",
    "rooms": [
      {
        "id": "b13_r0",
        "name": "225 Conference VP Academic Support",
        "building": "FENS",
        "status": "free"
      }
    ]
  },
  {
    "id": "b14",
    "name": "IT",
    "rooms": [
      {
        "id": "b14_r0",
        "name": "Networking",
        "building": "IT",
        "status": "free"
      }
    ]
  }
];

export const ALL_ROOMS: Classroom[] = BUILDINGS.flatMap(b => b.rooms);