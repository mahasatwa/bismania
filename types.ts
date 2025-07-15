
export enum ParticipantType {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  ASSISTANT = 'ASSISTANT',
}

export interface Student {
  id: string; // nim
  nim: string;
  name: string;
  program: string;
  type: ParticipantType.STUDENT;
  photoUrl: string;
}

export interface Lecturer {
  id: string; // nuptk or name if nuptk is missing
  nuptk: string;
  name: string;
  homebase: string;
  type: ParticipantType.LECTURER;
  photoUrl: string;
}

export interface Assistant {
  id: string; // name
  name: string;
  role: string;
  type: ParticipantType.ASSISTANT;
  photoUrl: string;
}

export type Participant = Student | Lecturer | Assistant;

export interface Seat {
  id: string; // e.g., 'B1-1A' for Bus 1, Seat 1A
  seatNumber: string; // e.g., '1A', '10C'
  participantId: string | null;
}

export interface SpecialSpot {
    id: 'TOUR_LEADER' | 'DRIVER';
    participantId: string | null;
}

export interface Bus {
  id: number;
  name: string;
  seats: Seat[];
  specialSpots: {
    tourLeader: SpecialSpot,
    driver: SpecialSpot,
  };
}

export interface RequestLogEntry {
  id: string;
  type: 'REQUEST' | 'APPROVAL';
  timestamp: string;
  author: string;
  summary: string;
}
