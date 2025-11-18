/**
 * Файл: seeds/seed.ts
 * Описание: Скрипт для заполнения базы данных тестовыми данными
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, entities, bcryptjs
 */

// Импорт DataSource для подключения к БД
import { AppDataSource, initializeDatabase } from '../config/database.config';

// Импорт bcrypt для хеширования паролей
import * as bcrypt from 'bcryptjs';

// Импорт entities
import { User } from '../entities/User.entity';
import { Competition } from '../entities/Competition.entity';
import { Athlete } from '../entities/Athlete.entity';

// Импорт типов
import { UserRole, CompetitionType, CompetitionStatus } from '../types/common.types';

/**
 * Основная функция заполнения БД
 * Создает тестовые данные для разработки и тестирования
 */
async function seed() {
  try {
    // Логируем начало процесса
    console.log('🌱 Начало заполнения базы данных тестовыми данными...');

    // Инициализируем подключение к БД
    await initializeDatabase();

    // Получаем репозитории для работы с данными
    const userRepository = AppDataSource.getRepository(User);
    const competitionRepository = AppDataSource.getRepository(Competition);
    const athleteRepository = AppDataSource.getRepository(Athlete);

    // ==================================================
    // 1. Создание пользователей
    // ==================================================
    console.log('👤 Создание пользователей...');

    // Хешируем пароль для всех пользователей (для простоты одинаковый)
    const passwordHash = await bcrypt.hash('password123', 10);

    // Создаем администратора
    const admin = userRepository.create({
      email: 'admin@rgart.ru',
      passwordHash: passwordHash,
      username: 'admin',
      lastName: 'Админов',
      firstName: 'Администратор',
      middleName: 'Иванович',
      role: UserRole.ADMIN,
      emailVerified: true,
      isActive: true
    });
    await userRepository.save(admin);
    console.log('  ✅ Создан администратор: admin@rgart.ru');

    // Создаем организатора
    const organizer = userRepository.create({
      email: 'organizer@rgart.ru',
      passwordHash: passwordHash,
      username: 'organizer',
      lastName: 'Петрова',
      firstName: 'Елена',
      middleName: 'Сергеевна',
      role: UserRole.ORGANIZER,
      emailVerified: true,
      isActive: true
    });
    await userRepository.save(organizer);
    console.log('  ✅ Создан организатор: organizer@rgart.ru');

    // Создаем главного судью
    const chiefJudge = userRepository.create({
      email: 'chief.judge@rgart.ru',
      passwordHash: passwordHash,
      username: 'chief_judge',
      lastName: 'Смирнова',
      firstName: 'Ольга',
      middleName: 'Викторовна',
      role: UserRole.CHIEF_JUDGE,
      emailVerified: true,
      isActive: true
    });
    await userRepository.save(chiefJudge);
    console.log('  ✅ Создан главный судья: chief.judge@rgart.ru');

    // Создаем судей D-бригады (4 судьи)
    const dJudges = [];
    for (let i = 1; i <= 4; i++) {
      const judge = userRepository.create({
        email: `judge.d${i}@rgart.ru`,
        passwordHash: passwordHash,
        username: `judge_d${i}`,
        lastName: `Судьина${i}`,
        firstName: 'Мария',
        middleName: 'Александровна',
        role: UserRole.JUDGE_D,
        emailVerified: true,
        isActive: true
      });
      await userRepository.save(judge);
      dJudges.push(judge);
    }
    console.log('  ✅ Создано 4 судьи D-бригады');

    // Создаем судей E-бригады (4 судьи)
    const eJudges = [];
    for (let i = 1; i <= 4; i++) {
      const judge = userRepository.create({
        email: `judge.e${i}@rgart.ru`,
        passwordHash: passwordHash,
        username: `judge_e${i}`,
        lastName: `Оценкина${i}`,
        firstName: 'Анна',
        middleName: 'Петровна',
        role: UserRole.JUDGE_E,
        emailVerified: true,
        isActive: true
      });
      await userRepository.save(judge);
      eJudges.push(judge);
    }
    console.log('  ✅ Создано 4 судьи E-бригады');

    // Создаем судей A-бригады (4 судьи)
    const aJudges = [];
    for (let i = 1; i <= 4; i++) {
      const judge = userRepository.create({
        email: `judge.a${i}@rgart.ru`,
        passwordHash: passwordHash,
        username: `judge_a${i}`,
        lastName: `Артистова${i}`,
        firstName: 'Екатерина',
        middleName: 'Дмитриевна',
        role: UserRole.JUDGE_A,
        emailVerified: true,
        isActive: true
      });
      await userRepository.save(judge);
      aJudges.push(judge);
    }
    console.log('  ✅ Создано 4 судьи A-бригады');

    // Создаем тренера
    const coach = userRepository.create({
      email: 'coach@rgart.ru',
      passwordHash: passwordHash,
      username: 'coach',
      lastName: 'Тренеров',
      firstName: 'Иван',
      middleName: 'Сергеевич',
      role: UserRole.COACH,
      emailVerified: true,
      isActive: true
    });
    await userRepository.save(coach);
    console.log('  ✅ Создан тренер: coach@rgart.ru');

    // ==================================================
    // 2. Создание соревнования
    // ==================================================
    console.log('🏆 Создание соревнования...');

    const competition = competitionRepository.create({
      name: 'Кубок России 2025',
      fullName: 'Открытый Кубок России по художественной гимнастике 2025',
      description: 'Всероссийское соревнование по художественной гимнастике',
      type: CompetitionType.INDIVIDUAL,
      status: CompetitionStatus.PUBLISHED,
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-17'),
      location: 'Москва',
      venue: 'Спортивный комплекс "Лужники", ул. Лужники, д. 24',
      organizerId: organizer.id,
      chiefJudgeId: chiefJudge.id,
      registrationOpen: true,
      registrationStartDate: new Date('2025-11-01'),
      registrationEndDate: new Date('2025-12-01'),
      maxParticipants: 100,
      entryFee: 5000
    });
    await competitionRepository.save(competition);
    console.log(`  ✅ Создано соревнование: "${competition.name}"`);

    // ==================================================
    // 3. Создание спортсменов
    // ==================================================
    console.log('🤸 Создание спортсменов...');

    // Массив имен для генерации разных спортсменов
    const lastNames = [
      'Иванова',
      'Петрова',
      'Сидорова',
      'Кузнецова',
      'Смирнова',
      'Васильева',
      'Попова',
      'Соколова',
      'Михайлова',
      'Новикова'
    ];
    const firstNames = [
      'Анна',
      'Мария',
      'Елена',
      'Ольга',
      'Наталья',
      'Татьяна',
      'Юлия',
      'Екатерина',
      'Дарья',
      'Александра'
    ];
    const cities = [
      'Москва',
      'Санкт-Петербург',
      'Казань',
      'Екатеринбург',
      'Новосибирск',
      'Самара',
      'Уфа',
      'Краснодар',
      'Воронеж',
      'Нижний Новгород'
    ];

    // Создаем 10 спортсменов
    for (let i = 0; i < 10; i++) {
      const athlete = athleteRepository.create({
        lastName: lastNames[i],
        firstName: firstNames[i],
        middleName: 'Ивановна',
        dateOfBirth: new Date(2010 + i % 3, i % 12, (i % 28) + 1), // Разные даты рождения
        gender: 'F',
        country: 'RUS',
        city: cities[i],
        clubName: `СДЮШОР №${i + 1} ${cities[i]}`,
        coachId: coach.id,
        coachName: coach.getFullName(),
        qualification: i < 3 ? 'МС' : i < 6 ? 'КМС' : 'I разряд',
        medicalClearanceUntil: new Date('2026-12-31'),
        insuranceValidUntil: new Date('2026-12-31'),
        status: 'active'
      });
      await athleteRepository.save(athlete);
    }
    console.log('  ✅ Создано 10 спортсменов');

    // ==================================================
    // Завершение
    // ==================================================
    console.log('');
    console.log('✅ Заполнение базы данных завершено успешно!');
    console.log('');
    console.log('📊 Статистика:');
    console.log(`  - Пользователей: ${await userRepository.count()}`);
    console.log(`  - Соревнований: ${await competitionRepository.count()}`);
    console.log(`  - Спортсменов: ${await athleteRepository.count()}`);
    console.log('');
    console.log('🔑 Данные для входа:');
    console.log('  Администратор: admin@rgart.ru / password123');
    console.log('  Организатор: organizer@rgart.ru / password123');
    console.log('  Главный судья: chief.judge@rgart.ru / password123');
    console.log('  Судья D1: judge.d1@rgart.ru / password123');
    console.log('  Тренер: coach@rgart.ru / password123');
    console.log('');

    // Закрываем подключение
    await AppDataSource.destroy();
  } catch (error) {
    // Логируем ошибку
    console.error('❌ Ошибка при заполнении БД:', error);
    // Закрываем подключение в случае ошибки
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    // Выходим с кодом ошибки
    process.exit(1);
  }
}

// Запускаем функцию seed
seed();

/**
 * ТЕСТЫ для seed скрипта
 *
 * Тест 1: Успешное выполнение seed
 * - Очистить БД
 * - Запустить seed скрипт
 * - Проверить, что созданы все пользователи (16 пользователей)
 * - Проверить, что создано соревнование
 * - Проверить, что созданы спортсмены (10 спортсменов)
 *
 * Тест 2: Проверка связей
 * - Загрузить соревнование с relation organizer
 * - Проверить, что organizer.email === 'organizer@rgart.ru'
 * - Загрузить спортсмена с relation coach
 * - Проверить, что coach.email === 'coach@rgart.ru'
 *
 * Тест 3: Проверка паролей
 * - Получить пользователя admin
 * - Проверить пароль через bcrypt.compare('password123', admin.passwordHash)
 * - Ожидать true
 *
 * Тест 4: Проверка уникальности email
 * - Попытаться запустить seed дважды
 * - Ожидать ошибку уникальности email на втором запуске
 *
 * Тест 5: Очистка БД
 * - Запустить seed
 * - Очистить все таблицы
 * - Проверить, что количество записей = 0
 * - Запустить seed снова
 * - Проверить, что данные созданы
 */
