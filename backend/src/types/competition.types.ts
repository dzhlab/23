/**
 * Типы данных для соревнований
 */

import { BaseEntityFields } from './common.types';
import { Apparatus, Gender } from './athlete.types';

/**
 * Статус соревнования
 */
export enum CompetitionStatus {
  DRAFT = 'draft',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Тип соревнования
 */
export enum CompetitionType {
  INDIVIDUAL_ALL_AROUND = 'individual_all_around',
  TEAM = 'team',
  APPARATUS_FINALS = 'apparatus_finals',
  QUALIFICATION = 'qualification',
}

/**
 * Уровень соревнования
 */
export enum CompetitionLevel {
  LOCAL = 'local',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
  WORLD_CUP = 'world_cup',
  WORLD_CHAMPIONSHIP = 'world_championship',
  OLYMPIC_GAMES = 'olympic_games',
}

/**
 * Полная информация о соревновании
 */
export interface Competition extends BaseEntityFields {
  name: string;
  description?: string;
  type: CompetitionType;
  level: CompetitionLevel;
  gender: Gender;
  apparatus?: Apparatus[];
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
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
}

/**
 * Данные для создания соревнования
 */
export interface CreateCompetitionData {
  name: string;
  description?: string;
  type: CompetitionType;
  level: CompetitionLevel;
  gender: Gender;
  apparatus?: Apparatus[];
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
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

/**
 * Данные для обновления соревнования
 */
export interface UpdateCompetitionData {
  name?: string;
  description?: string;
  type?: CompetitionType;
  level?: CompetitionLevel;
  apparatus?: Apparatus[];
  startDate?: Date;
  endDate?: Date;
  registrationDeadline?: Date;
  location?: string;
  country?: string;
  city?: string;
  venue?: string;
  maxParticipants?: number;
  minAge?: number;
  maxAge?: number;
  status?: CompetitionStatus;
  chiefJudgeId?: string;
  rules?: string;
}

/**
 * Соревнование с количеством участников
 */
export interface CompetitionWithStats extends Competition {
  participantsCount: number;
  judgesCount: number;
}
