import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { User } from '../entities/User.entity';
import {
  RegisterUserData,
  UpdateUserData,
  SafeUser,
  PublicUser,
  UserRole,
} from '../types/user.types';
import * as bcrypt from 'bcrypt';

/**
 * Сервис для работы с пользователями
 */
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterUserData): Promise<SafeUser> {
    // Проверка существования пользователя
    const existingUser = await this.userRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      throw new Error('Пользователь с таким email или username уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Создание пользователя
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || UserRole.SPECTATOR,
    });

    const savedUser = await this.userRepository.save(user);

    // Возврат без пароля
    const { password, ...safeUser } = savedUser;
    return safeUser as SafeUser;
  }

  /**
   * Получение пользователя по ID
   */
  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser as SafeUser;
  }

  /**
   * Получение пользователя по email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password', 'role', 'isBlocked'],
    });
  }

  /**
   * Получение пользователя по username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'email', 'username', 'password', 'role', 'isBlocked'],
    });
  }

  /**
   * Обновление профиля пользователя
   */
  async update(id: string, data: UpdateUserData): Promise<SafeUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    Object.assign(user, data);
    const updatedUser = await this.userRepository.save(user);

    const { password, ...safeUser } = updatedUser;
    return safeUser as SafeUser;
  }

  /**
   * Удаление пользователя
   */
  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Пользователь не найден');
    }
  }

  /**
   * Получение всех пользователей (публичная информация)
   */
  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      organization: user.organization,
      role: user.role,
    }));
  }

  /**
   * Блокировка пользователя
   */
  async block(id: string): Promise<void> {
    await this.userRepository.update(id, { isBlocked: true });
  }

  /**
   * Разблокировка пользователя
   */
  async unblock(id: string): Promise<void> {
    await this.userRepository.update(id, { isBlocked: false });
  }

  /**
   * Обновление времени последнего входа
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }
}
