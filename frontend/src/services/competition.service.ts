/**
 * Файл: services/competition.service.ts
 * Описание: Сервис для работы с соревнованиями
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: api.service, types
 */

// Импорт API сервиса
// Import API service
import { apiService } from './api.service';

// Импорт типов
// Import types
import {
  Competition,
  CreateCompetitionData,
  UpdateCompetitionData,
  CompetitionFilterParams,
  CompetitionStatistics
} from '../types';

/**
 * Класс для работы с соревнованиями
 * Competition service class
 */
class CompetitionService {
  // Базовый путь для эндпоинтов соревнований
  // Base path for competition endpoints
  private readonly basePath = '/competitions';

  /**
   * Получение списка соревнований с фильтрацией
   * Get list of competitions with filtering
   *
   * @param filters - параметры фильтрации / filter parameters
   * @returns Promise с массивом соревнований / Promise with competitions array
   */
  async getCompetitions(
    filters?: CompetitionFilterParams
  ): Promise<Competition[]> {
    // Отправляем GET запрос с параметрами фильтрации
    // Send GET request with filter parameters
    const response = await apiService.get<Competition[]>(
      this.basePath,
      filters
    );

    // Возвращаем массив соревнований
    // Return competitions array
    return response.data;
  }

  /**
   * Получение соревнования по ID
   * Get competition by ID
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise с данными соревнования / Promise with competition data
   */
  async getCompetitionById(competitionId: string): Promise<Competition> {
    // Отправляем GET запрос на получение соревнования
    // Send GET request to get competition
    const response = await apiService.get<Competition>(
      `${this.basePath}/${competitionId}`
    );

    // Возвращаем данные соревнования
    // Return competition data
    return response.data;
  }

  /**
   * Создание нового соревнования (только для организаторов)
   * Create new competition (organizers only)
   *
   * @param data - данные для создания / creation data
   * @returns Promise с созданным соревнованием / Promise with created competition
   */
  async createCompetition(
    data: CreateCompetitionData
  ): Promise<Competition> {
    // Отправляем POST запрос на создание соревнования
    // Send POST request to create competition
    const response = await apiService.post<Competition>(
      this.basePath,
      data
    );

    // Возвращаем данные созданного соревнования
    // Return created competition data
    return response.data;
  }

  /**
   * Обновление соревнования (только для организаторов)
   * Update competition (organizers only)
   *
   * @param competitionId - ID соревнования / competition ID
   * @param data - данные для обновления / update data
   * @returns Promise с обновленным соревнованием / Promise with updated competition
   */
  async updateCompetition(
    competitionId: string,
    data: UpdateCompetitionData
  ): Promise<Competition> {
    // Отправляем PUT запрос на обновление соревнования
    // Send PUT request to update competition
    const response = await apiService.put<Competition>(
      `${this.basePath}/${competitionId}`,
      data
    );

    // Возвращаем данные обновленного соревнования
    // Return updated competition data
    return response.data;
  }

  /**
   * Удаление соревнования (только для организаторов)
   * Delete competition (organizers only)
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise с результатом / Promise with result
   */
  async deleteCompetition(competitionId: string): Promise<void> {
    // Отправляем DELETE запрос на удаление соревнования
    // Send DELETE request to delete competition
    await apiService.delete(`${this.basePath}/${competitionId}`);
  }

  /**
   * Публикация соревнования (только для организаторов)
   * Publish competition (organizers only)
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise с обновленным соревнованием / Promise with updated competition
   */
  async publishCompetition(competitionId: string): Promise<Competition> {
    // Отправляем POST запрос на публикацию соревнования
    // Send POST request to publish competition
    const response = await apiService.post<Competition>(
      `${this.basePath}/${competitionId}/publish`
    );

    // Возвращаем данные обновленного соревнования
    // Return updated competition data
    return response.data;
  }

  /**
   * Отмена соревнования (только для организаторов)
   * Cancel competition (organizers only)
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise с обновленным соревнованием / Promise with updated competition
   */
  async cancelCompetition(competitionId: string): Promise<Competition> {
    // Отправляем POST запрос на отмену соревнования
    // Send POST request to cancel competition
    const response = await apiService.post<Competition>(
      `${this.basePath}/${competitionId}/cancel`
    );

    // Возвращаем данные обновленного соревнования
    // Return updated competition data
    return response.data;
  }

  /**
   * Получение статистики соревнования
   * Get competition statistics
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise со статистикой / Promise with statistics
   */
  async getCompetitionStatistics(
    competitionId: string
  ): Promise<CompetitionStatistics> {
    // Отправляем GET запрос на получение статистики
    // Send GET request to get statistics
    const response = await apiService.get<CompetitionStatistics>(
      `${this.basePath}/${competitionId}/statistics`
    );

    // Возвращаем данные статистики
    // Return statistics data
    return response.data;
  }
}

// Создаем и экспортируем единственный экземпляр сервиса (Singleton)
// Create and export single service instance (Singleton)
export const competitionService = new CompetitionService();

/**
 * ТЕСТЫ для competition.service.ts
 *
 * Тест 1: getCompetitions возвращает массив соревнований
 * - Вызвать getCompetitions без фильтров
 * - Проверить GET запрос на /competitions
 * - Проверить возврат массива
 *
 * Тест 2: getCompetitions применяет фильтры
 * - Вызвать getCompetitions с фильтрами { status: 'published' }
 * - Проверить что фильтры переданы в query параметрах
 *
 * Тест 3: getCompetitionById получает соревнование
 * - Вызвать getCompetitionById('123')
 * - Проверить GET запрос на /competitions/123
 *
 * Тест 4: createCompetition создает соревнование
 * - Вызвать createCompetition с данными
 * - Проверить POST запрос на /competitions
 *
 * Тест 5: updateCompetition обновляет соревнование
 * - Вызвать updateCompetition('123', data)
 * - Проверить PUT запрос на /competitions/123
 *
 * Тест 6: deleteCompetition удаляет соревнование
 * - Вызвать deleteCompetition('123')
 * - Проверить DELETE запрос на /competitions/123
 *
 * Тест 7: publishCompetition публикует соревнование
 * - Вызвать publishCompetition('123')
 * - Проверить POST запрос на /competitions/123/publish
 *
 * Тест 8: cancelCompetition отменяет соревнование
 * - Вызвать cancelCompetition('123')
 * - Проверить POST запрос на /competitions/123/cancel
 *
 * Тест 9: getCompetitionStatistics получает статистику
 * - Вызвать getCompetitionStatistics('123')
 * - Проверить GET запрос на /competitions/123/statistics
 */
