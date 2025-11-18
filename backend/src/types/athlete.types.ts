/**
 * Типы данных для спортсменов
 */

import { BaseEntityFields } from './common.types';

/**
 * Пол спортсмена
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

/**
 * Гимнастические снаряды для мужчин
 */
export enum MaleApparatus {
  FLOOR_EXERCISE = 'floor_exercise',
  POMMEL_HORSE = 'pommel_horse',
  RINGS = 'rings',
  VAULT = 'vault',
  PARALLEL_BARS = 'parallel_bars',
  HORIZONTAL_BAR = 'horizontal_bar',
}

/**
 * Гимнастические снаряды для женщин
 */
export enum FemaleApparatus {
  VAULT = 'vault',
  UNEVEN_BARS = 'uneven_bars',
  BALANCE_BEAM = 'balance_beam',
  FLOOR_EXERCISE = 'floor_exercise',
}

/**
 * Все гимнастические снаряды
 */
export type Apparatus = MaleApparatus | FemaleApparatus;

/**
 * Категории спортсменов
 */
export enum AthleteCategory {
  JUNIOR = 'junior',
  SENIOR = 'senior',
  MASTER = 'master',
}

/**
 * Полная информация о спортсмене
 */
export interface Athlete extends BaseEntityFields {
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: Gender;
  country: string;
  city?: string;
  club?: string;
  coachName?: string;
  category: AthleteCategory;
  licenseNumber?: string;
  nationality?: string;
}

/**
 * Данные для создания профиля спортсмена
 */
export interface CreateAthleteData {
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: Gender;
  country: string;
  city?: string;
  club?: string;
  coachName?: string;
  category: AthleteCategory;
  licenseNumber?: string;
  nationality?: string;
}

/**
 * Данные для обновления профиля спортсмена
 */
export interface UpdateAthleteData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: Date;
  city?: string;
  club?: string;
  coachName?: string;
  category?: AthleteCategory;
  licenseNumber?: string;
  nationality?: string;
}

/**
 * Спортсмен с рейтингом
 */
export interface AthleteWithRating extends Athlete {
  totalScore: number;
  rank: number;
}
