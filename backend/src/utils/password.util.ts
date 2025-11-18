/**
 * Файл: utils/password.util.ts
 * Описание: Утилиты для работы с паролями (хеширование и проверка)
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: bcryptjs
 */

// Импорт библиотеки bcrypt для хеширования паролей
import * as bcrypt from 'bcryptjs';

/**
 * Количество раундов хеширования для bcrypt
 * Чем больше число, тем медленнее хеширование, но безопаснее
 * Рекомендуемое значение: 10-12
 * 10 раундов = ~60-80ms на хеш
 * 12 раундов = ~250-300ms на хеш
 */
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

/**
 * Хеширование пароля
 * Использует bcrypt для создания безопасного хеша пароля
 *
 * @param password - пароль в открытом виде
 * @returns Promise с хешированным паролем
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Генерируем соль (salt) для хеширования
    // Соль - это случайные данные, которые добавляются к паролю перед хешированием
    // Это защищает от rainbow table attacks
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    // Хешируем пароль с использованием соли
    const hash = await bcrypt.hash(password, salt);

    // Возвращаем хеш (соль уже включена в хеш)
    return hash;
  } catch (error) {
    // Логируем ошибку
    console.error('Ошибка при хешировании пароля:', error);

    // Пробрасываем ошибку дальше
    throw new Error('Не удалось захешировать пароль');
  }
};

/**
 * Проверка пароля
 * Сравнивает введенный пароль с хешем из базы данных
 *
 * @param password - пароль в открытом виде (введенный пользователем)
 * @param hash - хеш пароля из базы данных
 * @returns Promise<boolean> - true если пароли совпадают, false если нет
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    // Сравниваем пароль с хешем
    // bcrypt автоматически извлекает соль из хеша и использует ее для сравнения
    const isMatch = await bcrypt.compare(password, hash);

    // Возвращаем результат сравнения
    return isMatch;
  } catch (error) {
    // Логируем ошибку
    console.error('Ошибка при проверке пароля:', error);

    // В случае ошибки возвращаем false (пароль не совпал)
    return false;
  }
};

/**
 * Валидация пароля на соответствие требованиям безопасности
 * Проверяет минимальную длину, наличие букв, цифр и спецсимволов
 *
 * @param password - пароль для проверки
 * @returns объект с результатом валидации
 */
export interface PasswordValidationResult {
  // Общий результат валидации
  valid: boolean;
  // Массив ошибок (пустой если valid === true)
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  // Массив для хранения ошибок валидации
  const errors: string[] = [];

  // Проверка минимальной длины (минимум 8 символов)
  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  }

  // Проверка максимальной длины (максимум 128 символов для безопасности)
  if (password.length > 128) {
    errors.push('Пароль не должен превышать 128 символов');
  }

  // Проверка наличия хотя бы одной заглавной буквы
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }

  // Проверка наличия хотя бы одной строчной буквы
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  }

  // Проверка наличия хотя бы одной цифры
  if (!/[0-9]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }

  // Проверка наличия хотя бы одного спецсимвола
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы один спецсимвол');
  }

  // Проверка на запрещенные последовательности (например: 12345, abcde)
  const commonSequences = ['12345', 'abcde', 'qwerty', 'password', '123456'];
  const lowerPassword = password.toLowerCase();
  for (const sequence of commonSequences) {
    if (lowerPassword.includes(sequence)) {
      errors.push('Пароль содержит слишком простую последовательность символов');
      break;
    }
  }

  // Возвращаем результат валидации
  return {
    valid: errors.length === 0,
    errors: errors
  };
};

/**
 * Генерация случайного пароля
 * Полезно для создания временных паролей при регистрации
 *
 * @param length - длина генерируемого пароля (по умолчанию 12)
 * @returns случайно сгенерированный пароль
 */
export const generateRandomPassword = (length: number = 12): string => {
  // Наборы символов для генерации пароля
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Заглавные буквы
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'; // Строчные буквы
  const numbers = '0123456789'; // Цифры
  const special = '!@#$%^&*()_+-=[]{}'; // Спецсимволы

  // Объединяем все наборы
  const allChars = uppercase + lowercase + numbers + special;

  // Массив для хранения символов пароля
  const passwordChars: string[] = [];

  // Гарантируем наличие хотя бы одного символа каждого типа
  passwordChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  passwordChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  passwordChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  passwordChars.push(special[Math.floor(Math.random() * special.length)]);

  // Заполняем оставшиеся позиции случайными символами
  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Перемешиваем массив для случайного порядка символов
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  // Преобразуем массив в строку и возвращаем
  return passwordChars.join('');
};

/**
 * ТЕСТЫ для password.util.ts
 *
 * Тест 1: Хеширование пароля
 * - Вызвать hashPassword('mypassword123')
 * - Проверить, что возвращается строка
 * - Проверить, что хеш начинается с '$2a$' или '$2b$' (формат bcrypt)
 * - Проверить, что хеш не равен исходному паролю
 *
 * Тест 2: Проверка правильного пароля
 * - Захешировать пароль 'password123'
 * - Вызвать comparePassword('password123', hash)
 * - Ожидать true
 *
 * Тест 3: Проверка неправильного пароля
 * - Захешировать пароль 'password123'
 * - Вызвать comparePassword('wrongpassword', hash)
 * - Ожидать false
 *
 * Тест 4: Валидация сильного пароля
 * - Вызвать validatePassword('MyP@ssw0rd123')
 * - Проверить, что valid === true
 * - Проверить, что errors === []
 *
 * Тест 5: Валидация слабого пароля (короткий)
 * - Вызвать validatePassword('abc123')
 * - Проверить, что valid === false
 * - Проверить, что errors содержит ошибку о минимальной длине
 *
 * Тест 6: Валидация пароля без заглавных букв
 * - Вызвать validatePassword('mypassword123!')
 * - Проверить, что valid === false
 * - Проверить наличие ошибки о заглавной букве
 *
 * Тест 7: Валидация пароля с простой последовательностью
 * - Вызвать validatePassword('Password12345!')
 * - Проверить, что valid === false
 * - Проверить наличие ошибки о простой последовательности
 *
 * Тест 8: Генерация случайного пароля
 * - Вызвать generateRandomPassword(16)
 * - Проверить, что длина === 16
 * - Проверить наличие заглавной буквы, строчной, цифры и спецсимвола
 * - Вызвать validatePassword для сгенерированного пароля
 * - Ожидать valid === true
 *
 * Тест 9: Уникальность хешей
 * - Захешировать один и тот же пароль дважды
 * - Проверить, что хеши разные (из-за разных солей)
 * - Проверить, что оба хеша правильно сравниваются с исходным паролем
 */
