import 'reflect-metadata';
import { AppDataSource } from '../config/database.config';
import { User } from '../entities/User.entity';
import { Athlete } from '../entities/Athlete.entity';
import { Competition } from '../entities/Competition.entity';
import { UserRole } from '../types/user.types';
import { Gender, AthleteCategory, MaleApparatus } from '../types/athlete.types';
import {
  CompetitionStatus,
  CompetitionType,
  CompetitionLevel,
} from '../types/competition.types';
import * as bcrypt from 'bcrypt';

/**
 * Seed-данные для наполнения базы данных тестовыми значениями
 */
async function seed(): Promise<void> {
  try {
    console.log('🌱 Начало seed-процесса...');

    // Инициализация подключения к БД
    await AppDataSource.initialize();
    console.log('✅ Подключение к базе данных установлено');

    const userRepository = AppDataSource.getRepository(User);
    const athleteRepository = AppDataSource.getRepository(Athlete);
    const competitionRepository = AppDataSource.getRepository(Competition);

    // Очистка существующих данных (опционально)
    console.log('🧹 Очистка существующих данных...');
    await competitionRepository.delete({});
    await athleteRepository.delete({});
    await userRepository.delete({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Создание пользователей с разными ролями
    console.log('👥 Создание пользователей...');

    const admin = userRepository.create({
      email: 'admin@gymnastics.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Администратор',
      lastName: 'Системы',
      role: UserRole.ADMIN,
      emailVerified: true,
    });
    await userRepository.save(admin);

    const organizer = userRepository.create({
      email: 'organizer@gymnastics.com',
      username: 'organizer',
      password: hashedPassword,
      firstName: 'Организатор',
      lastName: 'Соревнований',
      country: 'Russia',
      role: UserRole.ORGANIZER,
      emailVerified: true,
    });
    await userRepository.save(organizer);

    const chiefJudge = userRepository.create({
      email: 'chiefjudge@gymnastics.com',
      username: 'chiefjudge',
      password: hashedPassword,
      firstName: 'Главный',
      lastName: 'Судья',
      country: 'Russia',
      role: UserRole.CHIEF_JUDGE,
      emailVerified: true,
    });
    await userRepository.save(chiefJudge);

    const difficultyJudge1 = userRepository.create({
      email: 'd-judge1@gymnastics.com',
      username: 'd_judge_1',
      password: hashedPassword,
      firstName: 'Судья',
      lastName: 'Сложности-1',
      country: 'Russia',
      role: UserRole.DIFFICULTY_JUDGE,
      emailVerified: true,
    });
    await userRepository.save(difficultyJudge1);

    const executionJudge1 = userRepository.create({
      email: 'e-judge1@gymnastics.com',
      username: 'e_judge_1',
      password: hashedPassword,
      firstName: 'Судья',
      lastName: 'Исполнения-1',
      country: 'Russia',
      role: UserRole.EXECUTION_JUDGE,
      emailVerified: true,
    });
    await userRepository.save(executionJudge1);

    const coach = userRepository.create({
      email: 'coach@gymnastics.com',
      username: 'coach',
      password: hashedPassword,
      firstName: 'Тренер',
      lastName: 'Иванов',
      country: 'Russia',
      organization: 'Спортивная школа №1',
      role: UserRole.COACH,
      emailVerified: true,
    });
    await userRepository.save(coach);

    const athlete1User = userRepository.create({
      email: 'athlete1@gymnastics.com',
      username: 'athlete_1',
      password: hashedPassword,
      firstName: 'Александр',
      lastName: 'Петров',
      country: 'Russia',
      role: UserRole.ATHLETE,
      emailVerified: true,
    });
    await userRepository.save(athlete1User);

    const athlete2User = userRepository.create({
      email: 'athlete2@gymnastics.com',
      username: 'athlete_2',
      password: hashedPassword,
      firstName: 'Дмитрий',
      lastName: 'Сидоров',
      country: 'Russia',
      role: UserRole.ATHLETE,
      emailVerified: true,
    });
    await userRepository.save(athlete2User);

    console.log(`✅ Создано ${await userRepository.count()} пользователей`);

    // Создание профилей спортсменов
    console.log('🏃 Создание профилей спортсменов...');

    const athlete1 = athleteRepository.create({
      userId: athlete1User.id,
      firstName: 'Александр',
      lastName: 'Петров',
      dateOfBirth: new Date('2005-03-15'),
      gender: Gender.MALE,
      country: 'Russia',
      city: 'Москва',
      club: 'Динамо',
      coachName: 'Иванов Тренер',
      category: AthleteCategory.SENIOR,
      licenseNumber: 'RUS-2023-001',
    });
    await athleteRepository.save(athlete1);

    const athlete2 = athleteRepository.create({
      userId: athlete2User.id,
      firstName: 'Дмитрий',
      lastName: 'Сидоров',
      dateOfBirth: new Date('2006-07-22'),
      gender: Gender.MALE,
      country: 'Russia',
      city: 'Санкт-Петербург',
      club: 'Зенит',
      coachName: 'Петров Тренер',
      category: AthleteCategory.JUNIOR,
      licenseNumber: 'RUS-2023-002',
    });
    await athleteRepository.save(athlete2);

    console.log(`✅ Создано ${await athleteRepository.count()} профилей спортсменов`);

    // Создание соревнований
    console.log('🏆 Создание соревнований...');

    const competition1 = competitionRepository.create({
      name: 'Кубок России по спортивной гимнастике 2025',
      description: 'Национальный чемпионат по спортивной гимнастике среди мужчин',
      type: CompetitionType.INDIVIDUAL_ALL_AROUND,
      level: CompetitionLevel.NATIONAL,
      gender: Gender.MALE,
      apparatus: [
        MaleApparatus.FLOOR_EXERCISE,
        MaleApparatus.POMMEL_HORSE,
        MaleApparatus.RINGS,
        MaleApparatus.VAULT,
        MaleApparatus.PARALLEL_BARS,
        MaleApparatus.HORIZONTAL_BAR,
      ],
      startDate: new Date('2025-06-15'),
      endDate: new Date('2025-06-18'),
      registrationDeadline: new Date('2025-06-01'),
      location: 'Москва, Россия',
      country: 'Russia',
      city: 'Москва',
      venue: 'Олимпийский спортивный комплекс Лужники',
      maxParticipants: 50,
      minAge: 16,
      status: CompetitionStatus.REGISTRATION_OPEN,
      organizerId: organizer.id,
      chiefJudgeId: chiefJudge.id,
      rules: 'Соревнования проводятся по правилам FIG 2025-2028',
    });
    await competitionRepository.save(competition1);

    const competition2 = competitionRepository.create({
      name: 'Первенство Москвы по гимнастике',
      description: 'Региональные соревнования среди юниоров',
      type: CompetitionType.TEAM,
      level: CompetitionLevel.REGIONAL,
      gender: Gender.MALE,
      apparatus: [MaleApparatus.FLOOR_EXERCISE, MaleApparatus.VAULT],
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-12'),
      registrationDeadline: new Date('2025-04-01'),
      location: 'Москва, Россия',
      country: 'Russia',
      city: 'Москва',
      venue: 'Дворец спорта Динамо',
      maxParticipants: 30,
      maxAge: 18,
      status: CompetitionStatus.DRAFT,
      organizerId: organizer.id,
    });
    await competitionRepository.save(competition2);

    console.log(`✅ Создано ${await competitionRepository.count()} соревнований`);

    console.log('\n🎉 Seed-процесс завершен успешно!');
    console.log('\n📊 Итоговая статистика:');
    console.log(`   - Пользователей: ${await userRepository.count()}`);
    console.log(`   - Спортсменов: ${await athleteRepository.count()}`);
    console.log(`   - Соревнований: ${await competitionRepository.count()}`);
    console.log('\n🔑 Тестовые учетные записи:');
    console.log('   - admin@gymnastics.com / password123 (Admin)');
    console.log('   - organizer@gymnastics.com / password123 (Organizer)');
    console.log('   - chiefjudge@gymnastics.com / password123 (Chief Judge)');
    console.log('   - athlete1@gymnastics.com / password123 (Athlete)');
    console.log('   - athlete2@gymnastics.com / password123 (Athlete)');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Ошибка в процессе seed:', error);
    process.exit(1);
  }
}

// Запуск seed
seed().catch((error) => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});
