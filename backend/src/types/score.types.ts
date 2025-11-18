/**
 * Типы данных для оценок и подсчета баллов
 */

import { BaseEntityFields } from './common.types';

/**
 * Типы бригад судей согласно FIG
 */
export enum JudgePanelType {
  D_PANEL = 'd_panel', // Difficulty (сложность)
  E_PANEL = 'e_panel', // Execution (исполнение)
  A_PANEL = 'a_panel', // Artistic (артистизм, только для вольных упражнений женщин)
}

/**
 * Полная информация об оценке
 */
export interface Score extends BaseEntityFields {
  performanceId: string;
  judgeId: string;
  panelType: JudgePanelType;
  score: number;
  deductions?: number;
  neutralDeductions?: number;
  notes?: string;
}

/**
 * Данные для создания оценки
 */
export interface CreateScoreData {
  performanceId: string;
  judgeId: string;
  panelType: JudgePanelType;
  score: number;
  deductions?: number;
  neutralDeductions?: number;
  notes?: string;
}

/**
 * Данные для обновления оценки
 */
export interface UpdateScoreData {
  score?: number;
  deductions?: number;
  neutralDeductions?: number;
  notes?: string;
}

/**
 * Итоговые оценки выступления
 */
export interface FinalScores {
  dScore: number; // Difficulty score
  eScore: number; // Execution score
  aScore?: number; // Artistic score (опционально)
  totalScore: number;
  neutralDeductions: number;
  penalty: number;
}

/**
 * Детализированные оценки
 */
export interface DetailedScores extends FinalScores {
  dPanelScores: number[];
  ePanelScores: number[];
  aPanelScores?: number[];
  individualScores: Score[];
}

/**
 * Сборка оценок от разных бригад
 */
export interface ScoreBreakdown {
  panelType: JudgePanelType;
  scores: number[];
  average: number;
  final: number;
}
