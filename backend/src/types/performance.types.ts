/**
 * Типы данных для выступлений спортсменов
 */

import { BaseEntityFields } from './common.types';
import { Apparatus } from './athlete.types';
import { FinalScores } from './score.types';

/**
 * Статус выступления
 */
export enum PerformanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISQUALIFIED = 'disqualified',
  DNS = 'dns', // Did not start
  DNF = 'dnf', // Did not finish
}

/**
 * Полная информация о выступлении
 */
export interface Performance extends BaseEntityFields {
  competitionId: string;
  athleteId: string;
  apparatus: Apparatus;
  startTime?: Date;
  endTime?: Date;
  orderNumber: number;
  status: PerformanceStatus;
  videoUrl?: string;
}

/**
 * Данные для создания выступления
 */
export interface CreatePerformanceData {
  competitionId: string;
  athleteId: string;
  apparatus: Apparatus;
  startTime?: Date;
  orderNumber: number;
}

/**
 * Данные для обновления выступления
 */
export interface UpdatePerformanceData {
  startTime?: Date;
  endTime?: Date;
  orderNumber?: number;
  status?: PerformanceStatus;
  videoUrl?: string;
}

/**
 * Выступление с оценками
 */
export interface PerformanceWithScores extends Performance {
  scores: FinalScores;
  rank?: number;
}

/**
 * Выступление с полной информацией
 */
export interface DetailedPerformance extends PerformanceWithScores {
  athleteName: string;
  competitionName: string;
  country: string;
}
