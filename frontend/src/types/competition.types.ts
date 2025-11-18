export enum CompetitionStatus {
  DRAFT = 'draft',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CompetitionType {
  INDIVIDUAL_ALL_AROUND = 'individual_all_around',
  TEAM = 'team',
  APPARATUS_FINALS = 'apparatus_finals',
  QUALIFICATION = 'qualification',
}

export enum CompetitionLevel {
  LOCAL = 'local',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
  WORLD_CUP = 'world_cup',
  WORLD_CHAMPIONSHIP = 'world_championship',
  OLYMPIC_GAMES = 'olympic_games',
}

export interface Competition {
  id: string;
  name: string;
  description?: string;
  type: CompetitionType;
  level: CompetitionLevel;
  gender: string;
  apparatus?: string[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  country: string;
  city: string;
  venue: string;
  maxParticipants?: number;
  minAge?: number;
  maxAge?: number;
  status: CompetitionStatus;
  organizerId: string;
  chiefJudgeId?: string;
  rules?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionData {
  name: string;
  description?: string;
  type: CompetitionType;
  level: CompetitionLevel;
  gender: string;
  apparatus?: string[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  country: string;
  city: string;
  venue: string;
  maxParticipants?: number;
  minAge?: number;
  maxAge?: number;
  chiefJudgeId?: string;
  rules?: string;
}
