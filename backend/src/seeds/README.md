# Seed данные для базы данных

Этот каталог содержит скрипты для заполнения базы данных тестовыми данными.

## Что такое seed данные?

Seed данные - это предварительно подготовленные данные для заполнения БД в целях разработки и тестирования.

## Файлы

### seed.ts
**Описание:** Основной скрипт для заполнения БД тестовыми данными

**Создает:**
- 1 администратор (admin@rgart.ru)
- 1 организатор (organizer@rgart.ru)
- 1 главный судья (chief.judge@rgart.ru)
- 4 судьи D-бригады (judge.d1-4@rgart.ru)
- 4 судьи E-бригады (judge.e1-4@rgart.ru)
- 4 судьи A-бригады (judge.a1-4@rgart.ru)
- 1 тренер (coach@rgart.ru)
- 1 соревнование (Кубок России 2025)
- 10 спортсменов

**Всего:** 16 пользователей, 1 соревнование, 10 спортсменов

## Запуск seed скрипта

### Предварительные требования
1. База данных должна быть создана
2. Миграции должны быть применены

### Команда запуска
```bash
npm run seed
```

### Альтернативный запуск через ts-node
```bash
npx ts-node src/seeds/seed.ts
```

## Данные для входа

После запуска seed скрипта можно войти в систему используя следующие учетные данные:

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@rgart.ru | password123 |
| Организатор | organizer@rgart.ru | password123 |
| Главный судья | chief.judge@rgart.ru | password123 |
| Судья D1 | judge.d1@rgart.ru | password123 |
| Судья D2 | judge.d2@rgart.ru | password123 |
| Судья D3 | judge.d3@rgart.ru | password123 |
| Судья D4 | judge.d4@rgart.ru | password123 |
| Судья E1 | judge.e1@rgart.ru | password123 |
| Судья E2 | judge.e2@rgart.ru | password123 |
| Судья E3 | judge.e3@rgart.ru | password123 |
| Судья E4 | judge.e4@rgart.ru | password123 |
| Судья A1 | judge.a1@rgart.ru | password123 |
| Судья A2 | judge.a2@rgart.ru | password123 |
| Судья A3 | judge.a3@rgart.ru | password123 |
| Судья A4 | judge.a4@rgart.ru | password123 |
| Тренер | coach@rgart.ru | password123 |

## Структура данных

### Пользователи
- **Администратор** - полный доступ ко всем функциям
- **Организатор** - управление соревнованиями
- **Главный судья** - контроль судейства
- **Судьи D/E/A** - оценка выступлений
- **Тренер** - управление спортсменами

### Соревнование
- **Название:** Кубок России 2025
- **Тип:** Индивидуальные выступления
- **Статус:** Опубликовано (открыта регистрация)
- **Даты:** 15-17 декабря 2025
- **Место:** Москва, Лужники
- **Макс. участников:** 100
- **Стоимость:** 5000 рублей

### Спортсмены
10 девочек из разных городов России:
- 3 Мастера спорта (МС)
- 3 Кандидата в мастера спорта (КМС)
- 4 I разряд

Каждый спортсмен:
- Привязан к тренеру
- Имеет действующий медицинский допуск
- Имеет действующую страховку
- Статус: Активен

## Очистка данных

### Полная очистка БД
```bash
npm run typeorm schema:drop
npm run typeorm migration:run
npm run seed
```

### Выборочная очистка (SQL)
```sql
-- Очистить только данные, сохранив структуру
TRUNCATE TABLE scores CASCADE;
TRUNCATE TABLE performances CASCADE;
TRUNCATE TABLE athletes CASCADE;
TRUNCATE TABLE competitions CASCADE;
TRUNCATE TABLE users CASCADE;
```

## Создание собственных seed скриптов

### Пример: Seed для дополнительных соревнований
```typescript
import { AppDataSource } from '../config/database.config';
import { Competition } from '../entities/Competition.entity';

async function seedCompetitions() {
  const repo = AppDataSource.getRepository(Competition);

  // Создаем соревнование
  const competition = repo.create({
    name: 'Первенство Москвы',
    type: CompetitionType.INDIVIDUAL,
    status: CompetitionStatus.DRAFT,
    // ... другие поля
  });

  await repo.save(competition);
  console.log('✅ Создано соревнование');
}
```

## Best Practices

1. **Идемпотентность** - скрипт можно запускать несколько раз без ошибок
2. **Транзакции** - используйте транзакции для атомарности операций
3. **Логирование** - выводите информацию о прогрессе
4. **Обработка ошибок** - корректно обрабатывайте и логируйте ошибки
5. **Реалистичные данные** - создавайте данные, похожие на production

## Troubleshooting

### Ошибка "duplicate key value violates unique constraint"
Данные уже существуют в БД. Очистите таблицы перед повторным запуском.

### Ошибка "insert or update on table violates foreign key constraint"
Проверьте порядок создания данных - сначала создаются родительские записи, потом дочерние.

### Seed скрипт зависает
Проверьте подключение к БД и логи PostgreSQL.

## Связанные файлы

- `backend/src/config/database.config.ts` - конфигурация БД
- `backend/src/entities/` - Entity классы
- `backend/src/migrations/` - миграции БД
- `database/schema/DATABASE_SCHEMA.md` - документация схемы

## Добавление seed в package.json

```json
{
  "scripts": {
    "seed": "ts-node src/seeds/seed.ts",
    "seed:prod": "NODE_ENV=production ts-node src/seeds/seed.ts"
  }
}
```
