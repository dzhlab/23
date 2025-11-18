/**
 * Файл: migrations/1731959400000-InitialSchema.ts
 * Описание: Начальная миграция - создание всех таблиц базы данных
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm
 */

// Импорт типов миграции из TypeORM
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Начальная миграция базы данных
 * Создает все основные таблицы системы
 */
export class InitialSchema1731959400000 implements MigrationInterface {
  // Имя миграции (должно совпадать с именем класса)
  name = 'InitialSchema1731959400000';

  /**
   * Метод выполнения миграции (up)
   * Создает все таблицы и индексы
   * @param queryRunner - интерфейс для выполнения SQL запросов
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================================================
    // 1. Создание ENUM типов
    // ==================================================

    // ENUM для ролей пользователей
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM (
        'admin',
        'organizer',
        'chief_judge',
        'chief_secretary',
        'judge_D',
        'judge_E',
        'judge_A',
        'timekeeper',
        'line_judge',
        'brigade_secretary',
        'stream_coordinator',
        'coach',
        'spectator'
      )
    `);

    // ENUM для типов соревнований
    await queryRunner.query(`
      CREATE TYPE "competition_type_enum" AS ENUM (
        'individual',
        'group',
        'general_physical'
      )
    `);

    // ENUM для статусов соревнований
    await queryRunner.query(`
      CREATE TYPE "competition_status_enum" AS ENUM (
        'draft',
        'published',
        'in_progress',
        'completed',
        'cancelled'
      )
    `);

    // ENUM для методов расчета D-оценки
    await queryRunner.query(`
      CREATE TYPE "d_score_calculation_method_enum" AS ENUM (
        'russian',
        'fig'
      )
    `);

    // ENUM для методов ранжирования
    await queryRunner.query(`
      CREATE TYPE "ranking_method_enum" AS ENUM (
        'simple_division',
        'division_with_skip',
        'tiebreak_by_components'
      )
    `);

    // ENUM для типов интерфейса судьи
    await queryRunner.query(`
      CREATE TYPE "judge_interface_type_enum" AS ENUM (
        'extended',
        'balanced',
        'simplified'
      )
    `);

    // ENUM для предметов
    await queryRunner.query(`
      CREATE TYPE "apparatus_type_enum" AS ENUM (
        'no_apparatus',
        'rope',
        'hoop',
        'ball',
        'clubs',
        'ribbon'
      )
    `);

    // ENUM для типов бригад
    await queryRunner.query(`
      CREATE TYPE "brigade_type_enum" AS ENUM (
        'D',
        'E',
        'A',
        'T',
        'L'
      )
    `);

    // ENUM для статусов оценок
    await queryRunner.query(`
      CREATE TYPE "score_status_enum" AS ENUM (
        'draft',
        'submitted',
        'approved',
        'consensus_required',
        'rejected'
      )
    `);

    // ENUM для статусов спортсменов
    await queryRunner.query(`
      CREATE TYPE "athlete_status_enum" AS ENUM (
        'active',
        'retired',
        'suspended'
      )
    `);

    // ENUM для статусов выступлений
    await queryRunner.query(`
      CREATE TYPE "performance_status_enum" AS ENUM (
        'scheduled',
        'in_progress',
        'completed',
        'dns',
        'dnf',
        'dq'
      )
    `);

    // ==================================================
    // 2. Создание таблицы users (Пользователи)
    // ==================================================
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "username" VARCHAR(100) NOT NULL UNIQUE,
        "last_name" VARCHAR(100) NOT NULL,
        "first_name" VARCHAR(100) NOT NULL,
        "middle_name" VARCHAR(100),
        "role" user_role_enum NOT NULL DEFAULT 'spectator',
        "phone" VARCHAR(20),
        "avatar" TEXT,
        "language" VARCHAR(10) NOT NULL DEFAULT 'ru',
        "timezone" VARCHAR(50) NOT NULL DEFAULT 'Europe/Moscow',
        "email_verified" BOOLEAN NOT NULL DEFAULT false,
        "email_verification_token" VARCHAR(255),
        "email_verification_expires" TIMESTAMP,
        "phone_verified" BOOLEAN NOT NULL DEFAULT false,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "is_blocked" BOOLEAN NOT NULL DEFAULT false,
        "block_reason" TEXT,
        "last_login_at" TIMESTAMP,
        "last_login_ip" VARCHAR(45),
        "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
        "account_locked_until" TIMESTAMP,
        "notification_settings" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Индексы для таблицы users
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "idx_users_username" ON "users" ("username")`);
    await queryRunner.query(`CREATE INDEX "idx_users_role" ON "users" ("role")`);

    // ==================================================
    // 3. Создание таблицы competitions (Соревнования)
    // ==================================================
    await queryRunner.query(`
      CREATE TABLE "competitions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "full_name" VARCHAR(500),
        "description" TEXT,
        "type" competition_type_enum NOT NULL,
        "status" competition_status_enum NOT NULL DEFAULT 'draft',
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "location" VARCHAR(200) NOT NULL,
        "venue" VARCHAR(500) NOT NULL,
        "organizer_id" uuid NOT NULL,
        "chief_judge_id" uuid,
        "chief_secretary_id" uuid,
        "d_score_method" d_score_calculation_method_enum NOT NULL DEFAULT 'fig',
        "ranking_method" ranking_method_enum NOT NULL DEFAULT 'tiebreak_by_components',
        "default_judge_interface" judge_interface_type_enum NOT NULL DEFAULT 'balanced',
        "logo" TEXT,
        "sponsors" JSONB,
        "regulations" TEXT,
        "max_participants" INTEGER,
        "registration_open" BOOLEAN NOT NULL DEFAULT false,
        "registration_start_date" TIMESTAMP,
        "registration_end_date" TIMESTAMP,
        "entry_fee" DECIMAL(10,2),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_competition_organizer" FOREIGN KEY ("organizer_id")
          REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_competition_chief_judge" FOREIGN KEY ("chief_judge_id")
          REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_competition_chief_secretary" FOREIGN KEY ("chief_secretary_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Индексы для таблицы competitions
    await queryRunner.query(`CREATE INDEX "idx_competitions_status" ON "competitions" ("status")`);
    await queryRunner.query(
      `CREATE INDEX "idx_competitions_start_date" ON "competitions" ("start_date")`
    );

    // ==================================================
    // 4. Создание таблицы athletes (Спортсмены)
    // ==================================================
    await queryRunner.query(`
      CREATE TABLE "athletes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "last_name" VARCHAR(100) NOT NULL,
        "first_name" VARCHAR(100) NOT NULL,
        "middle_name" VARCHAR(100),
        "date_of_birth" DATE NOT NULL,
        "gender" CHAR(1) NOT NULL,
        "country" VARCHAR(3) NOT NULL,
        "region" VARCHAR(200),
        "city" VARCHAR(200),
        "club_id" uuid,
        "club_name" VARCHAR(255) NOT NULL,
        "coach_id" uuid,
        "coach_name" VARCHAR(255) NOT NULL,
        "qualification" VARCHAR(100),
        "fig_license" VARCHAR(50),
        "email" VARCHAR(255),
        "phone" VARCHAR(20),
        "photo" TEXT,
        "medical_clearance_until" DATE,
        "insurance_valid_until" DATE,
        "biography" TEXT,
        "status" athlete_status_enum NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_athlete_coach" FOREIGN KEY ("coach_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Индексы для таблицы athletes
    await queryRunner.query(
      `CREATE INDEX "idx_athletes_last_name_first_name" ON "athletes" ("last_name", "first_name")`
    );
    await queryRunner.query(`CREATE INDEX "idx_athletes_club_name" ON "athletes" ("club_name")`);
    await queryRunner.query(
      `CREATE INDEX "idx_athletes_date_of_birth" ON "athletes" ("date_of_birth")`
    );

    // ==================================================
    // 5. Создание таблицы performances (Выступления)
    // ==================================================
    await queryRunner.query(`
      CREATE TABLE "performances" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "competition_id" uuid NOT NULL,
        "event_id" uuid NOT NULL,
        "participant_id" uuid NOT NULL,
        "participant_type" competition_type_enum NOT NULL,
        "apparatus" apparatus_type_enum NOT NULL,
        "performance_order" INTEGER NOT NULL,
        "start_time" TIMESTAMP,
        "end_time" TIMESTAMP,
        "duration" INTEGER,
        "d_score" DECIMAL(5,3),
        "e_score" DECIMAL(5,3),
        "a_score" DECIMAL(5,3),
        "neutral_deductions" DECIMAL(4,2) NOT NULL DEFAULT 0,
        "penalties" DECIMAL(4,2) NOT NULL DEFAULT 0,
        "final_score" DECIMAL(6,3),
        "rank" INTEGER,
        "status" performance_status_enum NOT NULL DEFAULT 'scheduled',
        "status_reason" TEXT,
        "video_url" TEXT,
        "comments" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_performance_competition" FOREIGN KEY ("competition_id")
          REFERENCES "competitions"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_performance_participant" FOREIGN KEY ("participant_id")
          REFERENCES "athletes"("id") ON DELETE CASCADE
      )
    `);

    // Индексы для таблицы performances
    await queryRunner.query(
      `CREATE INDEX "idx_performances_competition_event" ON "performances" ("competition_id", "event_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_performances_participant" ON "performances" ("participant_id")`
    );
    await queryRunner.query(`CREATE INDEX "idx_performances_status" ON "performances" ("status")`);
    await queryRunner.query(`CREATE INDEX "idx_performances_rank" ON "performances" ("rank")`);

    // ==================================================
    // 6. Создание таблицы scores (Оценки судей)
    // ==================================================
    await queryRunner.query(`
      CREATE TABLE "scores" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "performance_id" uuid NOT NULL,
        "judge_id" uuid NOT NULL,
        "brigade_type" brigade_type_enum NOT NULL,
        "judge_position" VARCHAR(10) NOT NULL,
        "total_score" DECIMAL(5,3) NOT NULL,
        "status" score_status_enum NOT NULL DEFAULT 'draft',
        "start_time" TIMESTAMP,
        "submit_time" TIMESTAMP,
        "judging_duration" INTEGER,
        "comment" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_score_performance" FOREIGN KEY ("performance_id")
          REFERENCES "performances"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_score_judge" FOREIGN KEY ("judge_id")
          REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "uq_score_performance_judge" UNIQUE ("performance_id", "judge_id")
      )
    `);

    // Индексы для таблицы scores
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_scores_performance_judge" ON "scores" ("performance_id", "judge_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_scores_brigade_type" ON "scores" ("brigade_type")`
    );
    await queryRunner.query(`CREATE INDEX "idx_scores_status" ON "scores" ("status")`);

    // ==================================================
    // 7. Создание триггера для updated_at
    // ==================================================

    // Функция для автоматического обновления updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Применяем триггер ко всем таблицам
    await queryRunner.query(`
      CREATE TRIGGER trigger_update_users_timestamp
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_competitions_timestamp
      BEFORE UPDATE ON competitions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_athletes_timestamp
      BEFORE UPDATE ON athletes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_performances_timestamp
      BEFORE UPDATE ON performances
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_scores_timestamp
      BEFORE UPDATE ON scores
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // ==================================================
    // 8. Создание триггера для автоматического расчета final_score
    // ==================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_final_score()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Если есть все оценки, рассчитываем финальную
        IF NEW.d_score IS NOT NULL AND NEW.e_score IS NOT NULL AND NEW.a_score IS NOT NULL THEN
          NEW.final_score := NEW.d_score + NEW.e_score + NEW.a_score - NEW.neutral_deductions - NEW.penalties;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_final_score
      BEFORE INSERT OR UPDATE ON performances
      FOR EACH ROW
      EXECUTE FUNCTION update_final_score();
    `);
  }

  /**
   * Метод отката миграции (down)
   * Удаляет все созданные таблицы и типы
   * @param queryRunner - интерфейс для выполнения SQL запросов
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление триггеров
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_final_score ON performances`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_scores_timestamp ON scores`);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_performances_timestamp ON performances`
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_athletes_timestamp ON athletes`
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_competitions_timestamp ON competitions`
    );
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_users_timestamp ON users`);

    // Удаление функций
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_final_score()`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);

    // Удаление таблиц (в обратном порядке из-за Foreign Keys)
    await queryRunner.query(`DROP TABLE IF EXISTS "scores" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "performances" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "athletes" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "competitions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

    // Удаление ENUM типов
    await queryRunner.query(`DROP TYPE IF EXISTS "performance_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "athlete_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "score_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "brigade_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "apparatus_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "judge_interface_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "ranking_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "d_score_calculation_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "competition_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "competition_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}

/**
 * ТЕСТЫ для миграции
 *
 * Тест 1: Выполнение миграции up
 * - Запустить миграцию up
 * - Проверить, что все таблицы созданы
 * - Проверить, что все ENUM типы созданы
 * - Проверить, что все индексы созданы
 *
 * Тест 2: Проверка Foreign Keys
 * - Попытаться вставить competition с несуществующим organizer_id
 * - Ожидать ошибку Foreign Key constraint
 *
 * Тест 3: Проверка UNIQUE constraints
 * - Вставить пользователя с email "test@example.com"
 * - Попытаться вставить второго с тем же email
 * - Ожидать ошибку уникальности
 *
 * Тест 4: Проверка триггера updated_at
 * - Вставить пользователя
 * - Подождать 1 секунду
 * - Обновить пользователя
 * - Проверить, что updated_at > created_at
 *
 * Тест 5: Проверка триггера final_score
 * - Вставить performance с d_score=5.5, e_score=8.2, a_score=7.8
 * - Установить neutral_deductions=0.3, penalties=0.1
 * - Проверить, что final_score = 21.1
 *
 * Тест 6: Выполнение миграции down
 * - Запустить миграцию down
 * - Проверить, что все таблицы удалены
 * - Проверить, что все ENUM типы удалены
 */
