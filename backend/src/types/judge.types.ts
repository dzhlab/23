/**
 * Типы данных для судей и их назначений
 */

import { BaseEntityFields } from './common.types';
import { JudgePanelType } from './score.types';
import { Apparatus } from './athlete.types';

/**
 * Категории судей FIG
 */
export enum JudgeCategory {
  CATEGORY_1 = 'category_1', // Национальный уровень
  CATEGORY_2 = 'category_2', // Региональный уровень
  CATEGORY_3 = 'category_3', // Международный уровень, бригада E
  CATEGORY_4 = 'category_4', // Международный уровень, бригада D
  BREVET = 'brevet', // Высшая категория FIG
}

/**
 * Назначение судьи на соревнование
 */
export interface JudgeAssignment extends BaseEntityFields {
  competitionId: string;
  judgeId: string;
  panelType: JudgePanelType;
  apparatus?: Apparatus;
  category: JudgeCategory;
  isActive: boolean;
}

/**
 * Данные для назначения судьи
 */
export interface CreateJudgeAssignmentData {
  competitionId: string;
  judgeId: string;
  panelType: JudgePanelType;
  apparatus?: Apparatus;
  category: JudgeCategory;
}

/**
 * Данные для обновления назначения судьи
 */
export interface UpdateJudgeAssignmentData {
  panelType?: JudgePanelType;
  apparatus?: Apparatus;
  category?: JudgeCategory;
  isActive?: boolean;
}

/**
 * Судья с назначениями
 */
export interface JudgeWithAssignments {
  judgeId: string;
  judgeName: string;
  assignments: JudgeAssignment[];
  totalAssignments: number;
}

/**
 * Статистика судейства
 */
export interface JudgeStatistics {
  judgeId: string;
  totalScoresGiven: number;
  averageScore: number;
  competitionsJudged: number;
  lastCompetitionDate?: Date;
}
