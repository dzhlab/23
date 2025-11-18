# База данных: Система управления соревнованиями по художественной гимнастике

**Файл:** database/schema/DATABASE_SCHEMA.md
**Описание:** Полная документация схемы базы данных PostgreSQL
**Автор:** Claude Code
**Дата создания:** 18.11.2025
**Последнее изменение:** 18.11.2025
**СУБД:** PostgreSQL 15+

---

## Содержание

1. [Обзор](#обзор)
2. [Диаграмма ER](#диаграмма-er)
3. [Таблицы](#таблицы)
4. [Индексы](#индексы)
5. [Связи (Foreign Keys)](#связи-foreign-keys)
6. [Представления (Views)](#представления-views)
7. [Триггеры](#триггеры)

---

## Обзор

База данных состоит из **15+ таблиц**, разделенных на следующие логические модули:

1. **Пользователи и аутентификация** - управление пользователями, ролями, сессиями
2. **Соревнования** - соревнования, события, расписание
3. **Участники** - спортсмены, команды, регистрации
4. **Судейство** - судьи, бригады, назначения
5. **Оценивание** - оценки, детализация D/E/A, консенсус
6. **Аудит** - логирование действий пользователей

---

## Диаграмма ER

```
┌─────────────────┐
│     users       │ (Пользователи)
└────────┬────────┘
         │ 1
         │
         │ N
    ┌────┴─────┬──────────────┬──────────────┐
    │          │              │              │
    V          V              V              V
┌───────┐  ┌──────────┐  ┌────────┐  ┌───────────┐
│judges │  │athletes  │  │competi-│  │audit_logs │
│       │  │          │  │tions   │  │           │
└───┬───┘  └────┬─────┘  └───┬────┘  └───────────┘
    │           │            │
    │ N         │ N          │ 1
    │           │            │
    │           │            │ N
    │           │      ┌─────┴──────────┐
    │           │      │ performances   │
    │           └──────┤                │
    │                  └─────┬──────────┘
    │ N                      │ 1
    │                        │
    │                        │ N
    │                  ┌─────┴──────────┐
    └──────────────────┤    scores      │
                       │                │
                       └────────────────┘
```

---

## Таблицы

### 1. users (Пользователи)

**Назначение:** Хранит информацию о всех пользователях системы

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email для входа |
| password_hash | VARCHAR(255) | NOT NULL | Хешированный пароль (bcrypt) |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Имя пользователя |
| last_name | VARCHAR(100) | NOT NULL | Фамилия |
| first_name | VARCHAR(100) | NOT NULL | Имя |
| middle_name | VARCHAR(100) | NULL | Отчество |
| role | ENUM | NOT NULL, DEFAULT 'spectator' | Роль (admin, organizer, judge_*, coach, etc.) |
| phone | VARCHAR(20) | NULL | Телефон |
| avatar | TEXT | NULL | URL аватара |
| language | VARCHAR(10) | DEFAULT 'ru' | Язык интерфейса |
| timezone | VARCHAR(50) | DEFAULT 'Europe/Moscow' | Часовой пояс |
| email_verified | BOOLEAN | DEFAULT false | Email подтвержден |
| email_verification_token | VARCHAR(255) | NULL | Токен подтверждения email |
| email_verification_expires | TIMESTAMP | NULL | Срок действия токена |
| phone_verified | BOOLEAN | DEFAULT false | Телефон подтвержден |
| is_active | BOOLEAN | DEFAULT true | Аккаунт активен |
| is_blocked | BOOLEAN | DEFAULT false | Аккаунт заблокирован |
| block_reason | TEXT | NULL | Причина блокировки |
| last_login_at | TIMESTAMP | NULL | Дата последнего входа |
| last_login_ip | VARCHAR(45) | NULL | IP последнего входа |
| failed_login_attempts | INTEGER | DEFAULT 0 | Количество неудачных попыток входа |
| account_locked_until | TIMESTAMP | NULL | Дата разблокировки после неудачных попыток |
| notification_settings | JSONB | NULL | Настройки уведомлений |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Индексы:**
- `idx_users_email` (UNIQUE) - для быстрого поиска по email
- `idx_users_username` (UNIQUE) - для быстрого поиска по username
- `idx_users_role` - для фильтрации по ролям

**Enum типы:**
- `user_role_enum`: admin, organizer, chief_judge, chief_secretary, judge_D, judge_E, judge_A, timekeeper, line_judge, brigade_secretary, stream_coordinator, coach, spectator

---

### 2. competitions (Соревнования)

**Назначение:** Хранит информацию о соревнованиях

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| name | VARCHAR(255) | NOT NULL | Название соревнования |
| full_name | VARCHAR(500) | NULL | Полное официальное название |
| description | TEXT | NULL | Описание |
| type | ENUM | NOT NULL | Тип (individual, group, general_physical) |
| status | ENUM | DEFAULT 'draft' | Статус (draft, published, in_progress, completed, cancelled) |
| start_date | TIMESTAMP | NOT NULL | Дата начала |
| end_date | TIMESTAMP | NOT NULL | Дата окончания |
| location | VARCHAR(200) | NOT NULL | Город |
| venue | VARCHAR(500) | NOT NULL | Адрес места проведения |
| organizer_id | UUID | NOT NULL, FK | ID организатора |
| chief_judge_id | UUID | NULL, FK | ID главного судьи |
| chief_secretary_id | UUID | NULL, FK | ID главного секретаря |
| d_score_method | ENUM | DEFAULT 'fig' | Метод расчета D-оценки (russian, fig) |
| ranking_method | ENUM | DEFAULT 'tiebreak_by_components' | Метод ранжирования |
| default_judge_interface | ENUM | DEFAULT 'balanced' | Тип интерфейса судьи (extended, balanced, simplified) |
| logo | TEXT | NULL | URL логотипа |
| sponsors | JSONB | NULL | Массив спонсоров |
| regulations | TEXT | NULL | URL регламента (PDF) |
| max_participants | INTEGER | NULL | Максимальное количество участников |
| registration_open | BOOLEAN | DEFAULT false | Открыта ли регистрация |
| registration_start_date | TIMESTAMP | NULL | Дата начала регистрации |
| registration_end_date | TIMESTAMP | NULL | Дата окончания регистрации |
| entry_fee | DECIMAL(10,2) | NULL | Стоимость участия (рубли) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Индексы:**
- `idx_competitions_status` - для фильтрации по статусу
- `idx_competitions_start_date` - для сортировки по дате

**Foreign Keys:**
- `organizer_id` → `users(id)` ON DELETE RESTRICT
- `chief_judge_id` → `users(id)` ON DELETE SET NULL
- `chief_secretary_id` → `users(id)` ON DELETE SET NULL

---

### 3. athletes (Спортсмены)

**Назначение:** Хранит информацию о спортсменах

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| last_name | VARCHAR(100) | NOT NULL | Фамилия |
| first_name | VARCHAR(100) | NOT NULL | Имя |
| middle_name | VARCHAR(100) | NULL | Отчество |
| date_of_birth | DATE | NOT NULL | Дата рождения |
| gender | CHAR(1) | NOT NULL | Пол (M/F) |
| country | VARCHAR(3) | NOT NULL | Страна (ISO код) |
| region | VARCHAR(200) | NULL | Регион |
| city | VARCHAR(200) | NULL | Город |
| club_id | UUID | NULL | ID клуба |
| club_name | VARCHAR(255) | NOT NULL | Название клуба |
| coach_id | UUID | NULL, FK | ID тренера |
| coach_name | VARCHAR(255) | NOT NULL | ФИО тренера |
| qualification | VARCHAR(100) | NULL | Разряд (МС, КМС, I разряд и т.д.) |
| fig_license | VARCHAR(50) | NULL | Номер лицензии FIG |
| email | VARCHAR(255) | NULL | Email |
| phone | VARCHAR(20) | NULL | Телефон |
| photo | TEXT | NULL | URL фото |
| medical_clearance_until | DATE | NULL | Медицинский допуск до |
| insurance_valid_until | DATE | NULL | Страховка до |
| biography | TEXT | NULL | Биография |
| status | ENUM | DEFAULT 'active' | Статус (active, retired, suspended) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Индексы:**
- `idx_athletes_last_name_first_name` - для поиска по имени
- `idx_athletes_club_name` - для поиска по клубу
- `idx_athletes_date_of_birth` - для фильтрации по возрасту

**Foreign Keys:**
- `coach_id` → `users(id)` ON DELETE SET NULL

---

### 4. performances (Выступления)

**Назначение:** Хранит информацию о выступлениях спортсменов

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| competition_id | UUID | NOT NULL, FK | ID соревнования |
| event_id | UUID | NOT NULL | ID события |
| participant_id | UUID | NOT NULL, FK | ID участника (athlete или team) |
| participant_type | ENUM | NOT NULL | Тип (individual, group) |
| apparatus | ENUM | NOT NULL | Предмет |
| performance_order | INTEGER | NOT NULL | Порядковый номер |
| start_time | TIMESTAMP | NULL | Время начала |
| end_time | TIMESTAMP | NULL | Время окончания |
| duration | INTEGER | NULL | Продолжительность (секунды) |
| d_score | DECIMAL(5,3) | NULL | D-оценка |
| e_score | DECIMAL(5,3) | NULL | E-оценка |
| a_score | DECIMAL(5,3) | NULL | A-оценка |
| neutral_deductions | DECIMAL(4,2) | DEFAULT 0 | Нейтральные сбавки |
| penalties | DECIMAL(4,2) | DEFAULT 0 | Штрафы |
| final_score | DECIMAL(6,3) | NULL | Финальная оценка |
| rank | INTEGER | NULL | Место |
| status | ENUM | DEFAULT 'scheduled' | Статус (scheduled, in_progress, completed, dns, dnf, dq) |
| status_reason | TEXT | NULL | Причина DNS/DNF/DQ |
| video_url | TEXT | NULL | URL видео |
| comments | TEXT | NULL | Комментарии |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Индексы:**
- `idx_performances_competition_event` - составной индекс для поиска по событию
- `idx_performances_participant` - для поиска выступлений участника
- `idx_performances_status` - для фильтрации по статусу
- `idx_performances_rank` - для сортировки по месту

**Foreign Keys:**
- `competition_id` → `competitions(id)` ON DELETE CASCADE
- `participant_id` → `athletes(id)` ON DELETE CASCADE

---

### 5. scores (Оценки судей)

**Назначение:** Хранит индивидуальные оценки судей

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| performance_id | UUID | NOT NULL, FK | ID выступления |
| judge_id | UUID | NOT NULL, FK | ID судьи |
| brigade_type | ENUM | NOT NULL | Тип бригады (D, E, A, T, L) |
| judge_position | VARCHAR(10) | NOT NULL | Позиция (D1, D2, E1, E2 и т.д.) |
| total_score | DECIMAL(5,3) | NOT NULL | Итоговая оценка судьи |
| status | ENUM | DEFAULT 'draft' | Статус (draft, submitted, approved, consensus_required, rejected) |
| start_time | TIMESTAMP | NULL | Время начала оценивания |
| submit_time | TIMESTAMP | NULL | Время отправки |
| judging_duration | INTEGER | NULL | Продолжительность (секунды) |
| comment | TEXT | NULL | Комментарий |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Индексы:**
- `idx_scores_performance_judge` (UNIQUE) - уникальная пара performance + judge
- `idx_scores_brigade_type` - для фильтрации по типу бригады
- `idx_scores_status` - для фильтрации по статусу

**Foreign Keys:**
- `performance_id` → `performances(id)` ON DELETE CASCADE
- `judge_id` → `users(id)` ON DELETE RESTRICT

**Constraints:**
- `UNIQUE(performance_id, judge_id)` - один судья может дать только одну оценку на выступление

---

### 6. difficulty_scores (D-оценки детально)

**Назначение:** Детализация D-оценок (трудность)

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| score_id | UUID | NOT NULL, FK, UNIQUE | ID оценки (one-to-one) |
| performance_id | UUID | NOT NULL, FK | ID выступления |
| judge_id | UUID | NOT NULL, FK | ID судьи |
| body_difficulty | DECIMAL(4,2) | NOT NULL | DB - трудность тела |
| apparatus_difficulty | DECIMAL(4,2) | NOT NULL | DA - трудность предмета |
| total_d_score | DECIMAL(5,3) | NOT NULL | DB + DA |
| body_elements_count | INTEGER | DEFAULT 0 | Количество засчитанных элементов тела |
| apparatus_elements_count | INTEGER | DEFAULT 0 | Количество засчитанных элементов предмета |
| unique_element_bonus | DECIMAL(3,2) | DEFAULT 0 | Бонус за уникальные элементы |
| notes | TEXT | NULL | Комментарий |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Foreign Keys:**
- `score_id` → `scores(id)` ON DELETE CASCADE
- `performance_id` → `performances(id)` ON DELETE CASCADE
- `judge_id` → `users(id)` ON DELETE RESTRICT

---

### 7. body_difficulty_elements (Элементы трудности тела)

**Назначение:** Хранит отдельные элементы трудности тела

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| difficulty_score_id | UUID | NOT NULL, FK | ID D-оценки |
| element_type | ENUM | NOT NULL | Тип (J - прыжок, B - равновесие, R - поворот, F - гибкость) |
| element_code | VARCHAR(20) | NOT NULL | Код элемента FIG (например: J.1.2.3) |
| difficulty_level | VARCHAR(1) | NOT NULL | Уровень (A-J) |
| value | DECIMAL(3,2) | NOT NULL | Стоимость элемента |
| counted | BOOLEAN | DEFAULT true | Засчитан ли |
| rejection_reason | TEXT | NULL | Причина незачета |
| sequence_number | INTEGER | NOT NULL | Порядковый номер |
| description | TEXT | NULL | Описание |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Foreign Keys:**
- `difficulty_score_id` → `difficulty_scores(id)` ON DELETE CASCADE

---

### 8. execution_scores (E-оценки детально)

**Назначение:** Детализация E-оценок (исполнение)

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| score_id | UUID | NOT NULL, FK, UNIQUE | ID оценки (one-to-one) |
| performance_id | UUID | NOT NULL, FK | ID выступления |
| judge_id | UUID | NOT NULL, FK | ID судьи |
| starting_score | DECIMAL(4,2) | DEFAULT 10.00 | Начальная оценка |
| total_deductions | DECIMAL(4,2) | DEFAULT 0 | Сумма сбавок |
| total_e_score | DECIMAL(5,3) | NOT NULL | 10.0 - сбавки |
| notes | TEXT | NULL | Комментарий |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Foreign Keys:**
- `score_id` → `scores(id)` ON DELETE CASCADE
- `performance_id` → `performances(id)` ON DELETE CASCADE
- `judge_id` → `users(id)` ON DELETE RESTRICT

---

### 9. execution_deductions (Сбавки исполнения)

**Назначение:** Детализация сбавок за технические ошибки

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| execution_score_id | UUID | NOT NULL, FK | ID E-оценки |
| deduction_type | ENUM | NOT NULL | Тип ошибки |
| description | TEXT | NOT NULL | Описание ошибки |
| deduction_value | DECIMAL(3,2) | NOT NULL | Величина сбавки (0.1, 0.3, 0.5) |
| count | INTEGER | DEFAULT 1 | Количество повторений |
| total_deduction | DECIMAL(4,2) | NOT NULL | deduction_value * count |
| timestamp | INTEGER | NULL | Временная метка в выступлении (секунды) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата обновления |

**Foreign Keys:**
- `execution_score_id` → `execution_scores(id)` ON DELETE CASCADE

---

### 10. user_audit_logs (Логи действий пользователей)

**Назначение:** Аудит всех важных операций пользователей

**Поля:**

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | UUID | PRIMARY KEY | Уникальный идентификатор |
| user_id | UUID | NOT NULL, FK | ID пользователя |
| action | VARCHAR(100) | NOT NULL | Тип действия |
| description | TEXT | NOT NULL | Описание |
| ip_address | VARCHAR(45) | NOT NULL | IP адрес |
| user_agent | TEXT | NULL | User Agent |
| metadata | JSONB | NULL | Дополнительные данные |
| result | VARCHAR(20) | NOT NULL | Результат (success, failure) |
| error_message | TEXT | NULL | Сообщение об ошибке |
| timestamp | TIMESTAMP | NOT NULL, DEFAULT NOW() | Временная метка |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Дата создания |

**Индексы:**
- `idx_audit_logs_user_id` - для поиска по пользователю
- `idx_audit_logs_action` - для фильтрации по действию
- `idx_audit_logs_timestamp` - для сортировки по времени

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

---

## Индексы

### Индексы для оптимизации производительности

1. **users**
   - `idx_users_email` (UNIQUE) - быстрый поиск по email при входе
   - `idx_users_username` (UNIQUE) - быстрый поиск по username
   - `idx_users_role` - фильтрация пользователей по роли

2. **competitions**
   - `idx_competitions_status` - фильтрация соревнований по статусу
   - `idx_competitions_start_date` - сортировка по дате начала

3. **athletes**
   - `idx_athletes_last_name_first_name` - поиск спортсменов по имени
   - `idx_athletes_club_name` - фильтрация по клубу
   - `idx_athletes_date_of_birth` - фильтрация по возрасту

4. **performances**
   - `idx_performances_competition_event` (составной) - поиск выступлений по событию
   - `idx_performances_participant` - выступления конкретного спортсмена
   - `idx_performances_rank` - сортировка по месту

5. **scores**
   - `idx_scores_performance_judge` (UNIQUE) - гарантия уникальности оценки
   - `idx_scores_brigade_type` - фильтрация по типу бригады

---

## Связи (Foreign Keys)

```sql
-- Соревнования
competitions.organizer_id → users.id
competitions.chief_judge_id → users.id
competitions.chief_secretary_id → users.id

-- Спортсмены
athletes.coach_id → users.id

-- Выступления
performances.competition_id → competitions.id
performances.participant_id → athletes.id

-- Оценки
scores.performance_id → performances.id
scores.judge_id → users.id

-- Детализация оценок
difficulty_scores.score_id → scores.id (ONE-TO-ONE)
execution_scores.score_id → scores.id (ONE-TO-ONE)

-- Элементы
body_difficulty_elements.difficulty_score_id → difficulty_scores.id
execution_deductions.execution_score_id → execution_scores.id

-- Аудит
user_audit_logs.user_id → users.id
```

---

## Представления (Views)

### view_competition_leaderboard

Автоматически рассчитываемая таблица результатов

```sql
CREATE VIEW view_competition_leaderboard AS
SELECT
  p.competition_id,
  p.event_id,
  p.participant_id,
  a.last_name,
  a.first_name,
  a.club_name,
  p.d_score,
  p.e_score,
  p.a_score,
  p.neutral_deductions,
  p.penalties,
  p.final_score,
  p.rank
FROM performances p
INNER JOIN athletes a ON p.participant_id = a.id
WHERE p.status = 'completed'
ORDER BY p.rank ASC;
```

### view_judge_statistics

Статистика работы судей

```sql
CREATE VIEW view_judge_statistics AS
SELECT
  s.judge_id,
  u.last_name,
  u.first_name,
  COUNT(*) as total_scores,
  AVG(s.judging_duration) as avg_duration,
  COUNT(CASE WHEN s.status = 'consensus_required' THEN 1 END) as consensus_count
FROM scores s
INNER JOIN users u ON s.judge_id = u.id
GROUP BY s.judge_id, u.last_name, u.first_name;
```

---

## Триггеры

### trigger_update_final_score

Автоматический пересчет финальной оценки при изменении компонентов

```sql
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

CREATE TRIGGER trigger_update_final_score
BEFORE INSERT OR UPDATE ON performances
FOR EACH ROW
EXECUTE FUNCTION update_final_score();
```

### trigger_update_timestamps

Автоматическое обновление поля updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем к каждой таблице
CREATE TRIGGER trigger_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_competitions_timestamp
BEFORE UPDATE ON competitions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ... и так далее для всех таблиц
```

---

## Заметки по производительности

1. **Использование UUID** - для предотвращения коллизий в распределенной системе
2. **Партиционирование** - таблицы `scores` и `audit_logs` могут быть партиционированы по дате
3. **Архивация** - старые соревнования можно переносить в архивную БД
4. **Кэширование** - результаты запросов кэшируются в Redis (60 секунд)
5. **Репликация** - рекомендуется настроить read-replica для отчетов

---

**Последнее обновление:** 18.11.2025
**Версия схемы:** 1.0.0
