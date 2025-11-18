/**
 * Файл: middleware/validation.middleware.ts
 * Описание: Middleware для валидации запросов с использованием Joi
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: joi, express, utils/errors
 */

// Импорт Joi для валидации схем
// Import Joi for schema validation
import Joi from 'joi';

// Импорт типов Express
// Import Express types
import { Request, Response, NextFunction } from 'express';

// Импорт кастомной ошибки валидации
// Import custom validation error
import { ValidationError } from '../utils/errors.util';

/**
 * Enum для указания части запроса для валидации
 * Enum for specifying request part to validate
 */
export enum ValidationType {
  BODY = 'body',      // Тело запроса / Request body
  QUERY = 'query',    // Query параметры / Query parameters
  PARAMS = 'params'   // URL параметры / URL parameters
}

/**
 * Middleware для валидации запросов
 * Middleware for request validation
 *
 * @param schema - Joi схема валидации / Joi validation schema
 * @param type - Часть запроса для валидации / Request part to validate
 * @returns Express middleware function
 */
export const validate = (schema: Joi.ObjectSchema, type: ValidationType = ValidationType.BODY) => {
  // Возвращаем middleware функцию
  // Return middleware function
  return (req: Request, res: Response, next: NextFunction): void => {
    // Получаем данные для валидации в зависимости от типа
    // Get data for validation based on type
    const dataToValidate = req[type];

    // Валидируем данные по схеме
    // Validate data against schema
    const { error, value } = schema.validate(dataToValidate, {
      // Удалить неизвестные поля / Strip unknown fields
      stripUnknown: true,
      // Прервать на первой ошибке / Abort on first error
      abortEarly: false,
      // Конвертировать типы (string to number, etc.) / Convert types
      convert: true
    });

    // Если есть ошибки валидации
    // If there are validation errors
    if (error) {
      // Формируем детали ошибок
      // Form error details
      const details = error.details.map((detail) => ({
        // Поле с ошибкой / Field with error
        field: detail.path.join('.'),
        // Сообщение об ошибке / Error message
        message: detail.message,
        // Тип ошибки / Error type
        type: detail.type
      }));

      // Выбрасываем ValidationError с деталями
      // Throw ValidationError with details
      throw new ValidationError('Ошибка валидации данных запроса', details);
    }

    // Заменяем оригинальные данные на провалидированные и очищенные
    // Replace original data with validated and cleaned data
    req[type] = value;

    // Передаем управление следующему middleware
    // Pass control to next middleware
    next();
  };
};

/**
 * СХЕМЫ ВАЛИДАЦИИ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
 * VALIDATION SCHEMAS FOR USERS
 */

/**
 * Схема для регистрации пользователя
 * Schema for user registration
 */
export const registerUserSchema = Joi.object({
  // Email - обязательный, валидный email
  // Email - required, valid email
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email должен быть валидным',
      'any.required': 'Email обязателен'
    }),

  // Пароль - обязательный, минимум 8 символов
  // Password - required, minimum 8 characters
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Пароль должен содержать минимум 8 символов',
      'string.max': 'Пароль не должен превышать 128 символов',
      'any.required': 'Пароль обязателен'
    }),

  // Username - обязательный, 3-30 символов, только буквы, цифры, _, -
  // Username - required, 3-30 chars, only letters, digits, _, -
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username может содержать только буквы и цифры',
      'string.min': 'Username должен содержать минимум 3 символа',
      'string.max': 'Username не должен превышать 30 символов',
      'any.required': 'Username обязателен'
    }),

  // Фамилия - обязательная
  // Last name - required
  lastName: Joi.string()
    .required()
    .messages({
      'any.required': 'Фамилия обязательна'
    }),

  // Имя - обязательное
  // First name - required
  firstName: Joi.string()
    .required()
    .messages({
      'any.required': 'Имя обязательно'
    }),

  // Отчество - необязательное
  // Middle name - optional
  middleName: Joi.string().optional(),

  // Роль - необязательная, из enum
  // Role - optional, from enum
  role: Joi.string()
    .valid('admin', 'organizer', 'chief_judge', 'chief_secretary', 'judge_D', 'judge_E', 'judge_A', 'timekeeper', 'line_judge', 'brigade_secretary', 'stream_coordinator', 'coach', 'spectator')
    .optional(),

  // Номер телефона - необязательный
  // Phone number - optional
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Неверный формат номера телефона'
    })
});

/**
 * Схема для входа пользователя
 * Schema for user login
 */
export const loginUserSchema = Joi.object({
  // Email или username
  // Email or username
  emailOrUsername: Joi.string()
    .required()
    .messages({
      'any.required': 'Email или username обязателен'
    }),

  // Пароль
  // Password
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Пароль обязателен'
    })
});

/**
 * Схема для обновления профиля
 * Schema for profile update
 */
export const updateProfileSchema = Joi.object({
  // Все поля необязательные
  // All fields optional
  username: Joi.string().alphanum().min(3).max(30).optional(),
  lastName: Joi.string().optional(),
  firstName: Joi.string().optional(),
  middleName: Joi.string().optional(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  avatarUrl: Joi.string().uri().optional()
});

/**
 * Схема для смены пароля
 * Schema for password change
 */
export const changePasswordSchema = Joi.object({
  // Старый пароль - обязательный
  // Old password - required
  oldPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Старый пароль обязателен'
    }),

  // Новый пароль - обязательный, минимум 8 символов
  // New password - required, minimum 8 characters
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Новый пароль должен содержать минимум 8 символов',
      'string.max': 'Новый пароль не должен превышать 128 символов',
      'any.required': 'Новый пароль обязателен'
    })
});

/**
 * СХЕМЫ ВАЛИДАЦИИ ДЛЯ СОРЕВНОВАНИЙ
 * VALIDATION SCHEMAS FOR COMPETITIONS
 */

/**
 * Схема для создания соревнования
 * Schema for competition creation
 */
export const createCompetitionSchema = Joi.object({
  // Название - обязательное
  // Name - required
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Название соревнования обязательно'
    }),

  // Полное название - необязательное
  // Full name - optional
  fullName: Joi.string().optional(),

  // Описание - необязательное
  // Description - optional
  description: Joi.string().optional(),

  // Тип - обязательный, enum
  // Type - required, enum
  type: Joi.string()
    .valid('individual', 'group')
    .required()
    .messages({
      'any.required': 'Тип соревнования обязателен',
      'any.only': 'Тип должен быть individual или group'
    }),

  // Дата начала - обязательная, должна быть датой
  // Start date - required, must be date
  startDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Дата начала обязательна',
      'date.base': 'Неверный формат даты начала'
    }),

  // Дата окончания - обязательная, должна быть после startDate
  // End date - required, must be after startDate
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .required()
    .messages({
      'any.required': 'Дата окончания обязательна',
      'date.base': 'Неверный формат даты окончания',
      'date.greater': 'Дата окончания должна быть позже даты начала'
    }),

  // Местоположение - обязательное
  // Location - required
  location: Joi.string()
    .required()
    .messages({
      'any.required': 'Местоположение обязательно'
    }),

  // Площадка - необязательная
  // Venue - optional
  venue: Joi.string().optional(),

  // ID организатора - необязательный (может быть взят из текущего пользователя)
  // Organizer ID - optional (can be taken from current user)
  organizerId: Joi.string().uuid().optional(),

  // ID главного судьи - необязательный
  // Chief judge ID - optional
  chiefJudgeId: Joi.string().uuid().optional(),

  // Даты регистрации - необязательные
  // Registration dates - optional
  registrationStartDate: Joi.date().optional(),
  registrationEndDate: Joi.date()
    .greater(Joi.ref('registrationStartDate'))
    .less(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.greater': 'Дата окончания регистрации должна быть позже даты начала',
      'date.less': 'Регистрация должна закончиться до начала соревнования'
    }),

  // Максимальное количество участников - необязательное, положительное число
  // Max participants - optional, positive number
  maxParticipants: Joi.number().integer().positive().optional(),

  // Стоимость участия - необязательная, неотрицательное число
  // Entry fee - optional, non-negative number
  entryFee: Joi.number().min(0).optional()
});

/**
 * Схема для обновления соревнования
 * Schema for competition update
 */
export const updateCompetitionSchema = Joi.object({
  // Все поля необязательные (partial update)
  // All fields optional (partial update)
  name: Joi.string().optional(),
  fullName: Joi.string().optional(),
  description: Joi.string().optional(),
  type: Joi.string().valid('individual', 'group').optional(),
  status: Joi.string().valid('draft', 'published', 'in_progress', 'finished', 'cancelled').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  location: Joi.string().optional(),
  venue: Joi.string().optional(),
  chiefJudgeId: Joi.string().uuid().allow(null).optional(),
  registrationOpen: Joi.boolean().optional(),
  registrationStartDate: Joi.date().optional(),
  registrationEndDate: Joi.date().optional(),
  maxParticipants: Joi.number().integer().positive().optional(),
  entryFee: Joi.number().min(0).optional()
});

/**
 * Схема для валидации UUID параметра
 * Schema for UUID parameter validation
 */
export const uuidParamSchema = Joi.object({
  // ID должен быть валидным UUID
  // ID must be valid UUID
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'ID должен быть валидным UUID',
      'any.required': 'ID обязателен'
    })
});

/**
 * ТЕСТЫ для validation.middleware.ts
 *
 * Тест 1: validate middleware валидирует body
 * - Создать схему Joi.object({ name: Joi.string().required() })
 * - Создать mock request с body = { name: 'Test' }
 * - Вызвать validate(schema, ValidationType.BODY)
 * - Проверить, что next() вызван без ошибок
 *
 * Тест 2: validate middleware выбрасывает ValidationError при невалидных данных
 * - Создать схему с обязательным полем
 * - Создать request без этого поля
 * - Вызвать validate
 * - Проверить, что выброшена ValidationError
 * - Проверить наличие details с описанием ошибки
 *
 * Тест 3: validate удаляет неизвестные поля (stripUnknown)
 * - Создать схему с полем 'name'
 * - Отправить request с полями 'name' и 'unknown'
 * - Вызвать validate
 * - Проверить, что req.body содержит только 'name'
 *
 * Тест 4: validate конвертирует типы
 * - Создать схему с Joi.number()
 * - Отправить request с строкой '123'
 * - Вызвать validate
 * - Проверить, что req.body содержит число 123
 *
 * Тест 5: registerUserSchema валидирует правильные данные
 * - Создать валидные данные регистрации
 * - Вызвать registerUserSchema.validate()
 * - Проверить отсутствие ошибок
 *
 * Тест 6: registerUserSchema отклоняет невалидный email
 * - Передать { email: 'invalid-email' }
 * - Вызвать validate
 * - Проверить наличие ошибки 'Email должен быть валидным'
 *
 * Тест 7: registerUserSchema отклоняет короткий пароль
 * - Передать { password: '12345' }
 * - Вызвать validate
 * - Проверить наличие ошибки о минимальной длине
 *
 * Тест 8: loginUserSchema требует emailOrUsername и password
 * - Передать пустой объект
 * - Вызвать validate
 * - Проверить наличие двух ошибок (для обоих полей)
 *
 * Тест 9: createCompetitionSchema валидирует даты
 * - Передать endDate раньше startDate
 * - Вызвать validate
 * - Проверить ошибку 'Дата окончания должна быть позже даты начала'
 *
 * Тест 10: createCompetitionSchema валидирует даты регистрации
 * - Передать registrationEndDate после startDate
 * - Вызвать validate
 * - Проверить ошибку о регистрации
 *
 * Тест 11: updateCompetitionSchema разрешает частичное обновление
 * - Передать только { name: 'New Name' }
 * - Вызвать validate
 * - Проверить отсутствие ошибок
 *
 * Тест 12: uuidParamSchema валидирует UUID
 * - Передать { id: 'invalid-uuid' }
 * - Вызвать validate
 * - Проверить ошибку 'ID должен быть валидным UUID'
 */
