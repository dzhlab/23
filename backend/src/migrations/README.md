# Миграции базы данных

Этот каталог содержит миграции TypeORM для управления схемой базы данных.

## Что такое миграции?

Миграции - это способ версионирования схемы базы данных. Каждая миграция содержит два метода:
- `up()` - применение изменений к БД
- `down()` - откат изменений

## Структура файла миграции

```typescript
export class MigrationName1234567890000 implements MigrationInterface {
  name = 'MigrationName1234567890000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // SQL команды для создания/изменения таблиц
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQL команды для отката изменений
  }
}
```

## Список миграций

### 1731959400000-InitialSchema.ts
**Дата создания:** 18.11.2025
**Описание:** Начальная миграция - создание всех основных таблиц

**Создает:**
- ENUM типы (user_role_enum, competition_type_enum и т.д.)
- Таблица `users` - пользователи системы
- Таблица `competitions` - соревнования
- Таблица `athletes` - спортсмены
- Таблица `performances` - выступления
- Таблица `scores` - оценки судей
- Индексы для оптимизации запросов
- Foreign Key constraints для связей
- Триггеры для автоматического обновления `updated_at`
- Триггер для автоматического расчета `final_score`

## Команды для работы с миграциями

### Создание новой миграции
```bash
npm run typeorm migration:create -- src/migrations/MigrationName
```

### Генерация миграции на основе изменений в entities
```bash
npm run typeorm migration:generate -- src/migrations/MigrationName
```

### Применение миграций
```bash
npm run typeorm migration:run
```

### Откат последней миграции
```bash
npm run typeorm migration:revert
```

### Показать статус миграций
```bash
npm run typeorm migration:show
```

## Правила работы с миграциями

1. **Никогда не редактируйте примененную миграцию** - создайте новую миграцию для изменений
2. **Всегда тестируйте метод `down()`** - убедитесь, что откат работает корректно
3. **Создавайте миграции атомарными** - одна миграция = одна логическая группа изменений
4. **Комментируйте сложные изменения** - объясните, зачем нужна миграция
5. **В production всегда используйте миграции** - никогда не используйте `synchronize: true`

## Порядок применения

Миграции применяются в порядке их timestamp (числа в имени файла):
1. 1731959400000-InitialSchema.ts
2. Следующая миграция...

## Примеры

### Добавление нового столбца
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users"
    ADD COLUMN "new_column" VARCHAR(255) DEFAULT 'default_value'
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users"
    DROP COLUMN "new_column"
  `);
}
```

### Создание новой таблицы
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE TABLE "new_table" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "name" VARCHAR(255) NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP TABLE IF EXISTS "new_table"`);
}
```

## Troubleshooting

### Ошибка "migration has already been executed"
Миграция уже применена. Проверьте таблицу `migrations` в БД.

### Ошибка "relation already exists"
Таблица или индекс уже существует. Проверьте состояние БД или используйте `IF NOT EXISTS`.

### Как сбросить все миграции
```bash
# ВНИМАНИЕ: Это удалит ВСЕ данные!
npm run typeorm schema:drop
npm run typeorm migration:run
```

## Связанные файлы

- `backend/src/config/database.config.ts` - конфигурация TypeORM
- `backend/src/entities/` - Entity классы
- `database/schema/DATABASE_SCHEMA.md` - документация схемы БД
