# Руководство по использованию кастомных ошибок

## Обзор

Система предоставляет набор кастомных классов ошибок для централизованной обработки ошибок в API.

## Доступные классы ошибок

### 1. AppError (базовый класс)
Базовый класс для всех кастомных ошибок.

```typescript
import { AppError } from '../utils/errors.util';

throw new AppError('Сообщение об ошибке', 500, 'ERROR_CODE', true);
```

**Параметры:**
- `message` - текст ошибки
- `statusCode` - HTTP код (по умолчанию 500)
- `errorCode` - код для клиента
- `isOperational` - операционная ли ошибка (по умолчанию true)

### 2. ValidationError (400)
Для ошибок валидации данных.

```typescript
import { ValidationError } from '../utils/errors.util';

// Простая ошибка валидации
throw new ValidationError('Email должен быть валидным');

// С деталями
throw new ValidationError('Ошибка валидации', {
  field: 'email',
  value: 'invalid-email',
  constraint: 'isEmail'
});
```

**Когда использовать:**
- Невалидный формат email
- Слишком короткий/длинный пароль
- Отсутствие обязательных полей
- Неправильный формат данных

### 3. AuthenticationError (401)
Для ошибок аутентификации.

```typescript
import { AuthenticationError } from '../utils/errors.util';

throw new AuthenticationError('Неверный email или пароль', 'INVALID_CREDENTIALS');
throw new AuthenticationError('Токен истек', 'TOKEN_EXPIRED');
```

**Когда использовать:**
- Неверный пароль
- Истекший токен
- Отсутствие токена
- Невалидный токен

### 4. AuthorizationError (403)
Для ошибок авторизации (недостаточно прав).

```typescript
import { AuthorizationError } from '../utils/errors.util';

throw new AuthorizationError('Только администраторы могут выполнить это действие');
```

**Когда использовать:**
- Попытка доступа без нужной роли
- Попытка редактировать чужие данные
- Доступ к запрещенному ресурсу

### 5. NotFoundError (404)
Для ошибок "ресурс не найден".

```typescript
import { NotFoundError } from '../utils/errors.util';

throw new NotFoundError('Пользователь', userId);
throw new NotFoundError('Соревнование', competitionId);
```

**Когда использовать:**
- Пользователь не найден по ID
- Соревнование не существует
- Выступление не найдено

### 6. ConflictError (409)
Для конфликтов данных (дубликаты).

```typescript
import { ConflictError } from '../utils/errors.util';

throw new ConflictError('Пользователь с таким email уже существует');
throw new ConflictError('Username уже занят', 'DUPLICATE_USERNAME');
```

**Когда использовать:**
- Email уже зарегистрирован
- Username уже занят
- Попытка создать дубликат записи

### 7. BusinessLogicError (422)
Для ошибок бизнес-логики.

```typescript
import { BusinessLogicError } from '../utils/errors.util';

throw new BusinessLogicError('Регистрация на соревнование закрыта');
throw new BusinessLogicError('Нельзя удалить опубликованное соревнование');
```

**Когда использовать:**
- Нарушение бизнес-правил
- Операция невозможна в текущем состоянии
- Логические ограничения

### 8. DatabaseError (500)
Для ошибок базы данных.

```typescript
import { DatabaseError } from '../utils/errors.util';

try {
  await repository.save(entity);
} catch (error) {
  throw new DatabaseError('Не удалось сохранить данные', error);
}
```

## Использование в сервисах

### Пример: UserService

```typescript
import {
  ValidationError,
  ConflictError,
  AuthenticationError,
  NotFoundError
} from '../utils/errors.util';

export class UserService {
  async register(data: RegisterUserData): Promise<AuthResult> {
    // Валидация
    const validation = validatePassword(data.password);
    if (!validation.valid) {
      throw new ValidationError('Пароль не соответствует требованиям', {
        errors: validation.errors
      });
    }

    // Проверка дубликата email
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email }
    });
    if (existingUser) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }

    // ... остальная логика
  }

  async login(data: LoginUserData): Promise<AuthResult> {
    const user = await this.userRepository.findOne({
      where: { email: data.emailOrUsername }
    });

    if (!user) {
      throw new AuthenticationError('Неверный email или пароль');
    }

    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Неверный email или пароль');
    }

    // ... остальная логика
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('Пользователь', userId);
    }

    return user;
  }
}
```

## Использование в контроллерах

Контроллеры НЕ должны обрабатывать ошибки - просто передавать их в `next()`:

```typescript
export class UserController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);  // Просто передаем ошибку дальше
    }
  }
}
```

## Использование asyncHandler

Для автоматической обработки ошибок в async функциях:

```typescript
import { asyncHandler } from '../utils/errors.util';

// Вместо try-catch в каждом методе
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ success: true, data: user });
}));
```

## Обработка ошибок в middleware

```typescript
import { errorHandler, notFoundHandler } from '../utils/errors.util';

// В конце всех роутов
app.use(notFoundHandler);
app.use(errorHandler);
```

## Формат ответа клиенту

Все ошибки автоматически преобразуются в JSON:

### ValidationError
```json
{
  "success": false,
  "message": "Пароль не соответствует требованиям",
  "errorCode": "VALIDATION_ERROR",
  "details": {
    "errors": ["Минимум 8 символов", "Нужна заглавная буква"]
  }
}
```

### AuthenticationError
```json
{
  "success": false,
  "message": "Неверный email или пароль",
  "errorCode": "INVALID_CREDENTIALS"
}
```

### NotFoundError
```json
{
  "success": false,
  "message": "Пользователь с идентификатором \"123\" не найден",
  "errorCode": "NOT_FOUND"
}
```

### ConflictError
```json
{
  "success": false,
  "message": "Пользователь с таким email уже существует",
  "errorCode": "CONFLICT"
}
```

## Режим разработки

В development режиме добавляется `stack` trace:

```json
{
  "success": false,
  "message": "Ошибка базы данных",
  "errorCode": "DATABASE_ERROR",
  "stack": "Error: ...\n    at UserService.register ..."
}
```

## Best Practices

1. **Всегда используйте специализированные ошибки** вместо базового `Error`
2. **Не показывайте техничес детали** в production (stack traces, SQL ошибки)
3. **Используйте понятные сообщения** для пользователей
4. **Добавляйте errorCode** для программной обработки на клиенте
5. **Логируйте все ошибки** для отладки
6. **Не дублируйте try-catch** - используйте `asyncHandler`

## Примеры замены стандартных ошибок

### ❌ Плохо
```typescript
if (!user) {
  throw new Error('User not found');
}
```

### ✅ Хорошо
```typescript
if (!user) {
  throw new NotFoundError('Пользователь', userId);
}
```

### ❌ Плохо
```typescript
if (existingUser) {
  throw new Error('Email already exists');
}
```

### ✅ Хорошо
```typescript
if (existingUser) {
  throw new ConflictError('Пользователь с таким email уже существует');
}
```

### ❌ Плохо
```typescript
if (!isPasswordValid) {
  throw new Error('Invalid password');
}
```

### ✅ Хорошо
```typescript
if (!isPasswordValid) {
  throw new AuthenticationError('Неверный email или пароль');
}
```

## Интеграция с TypeORM

TypeORM ошибки автоматически обрабатываются в `errorHandler`:

- `QueryFailedError` → 500 DATABASE_QUERY_ERROR
- `EntityNotFoundError` → 404 NOT_FOUND
- Duplicate key errors → 409 DUPLICATE_ENTRY

Не нужно вручную обрабатывать эти ошибки!
