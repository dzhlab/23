import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Athlete } from '../entities/Athlete.entity';
import { CreateAthleteData, UpdateAthleteData } from '../types/athlete.types';

/**
 * Сервис для работы со спортсменами
 */
export class AthleteService {
  private athleteRepository: Repository<Athlete>;

  constructor() {
    this.athleteRepository = AppDataSource.getRepository(Athlete);
  }

  async create(data: CreateAthleteData): Promise<Athlete> {
    const athlete = this.athleteRepository.create(data);
    return this.athleteRepository.save(athlete);
  }

  async findById(id: string): Promise<Athlete | null> {
    return this.athleteRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Athlete | null> {
    return this.athleteRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async findAll(): Promise<Athlete[]> {
    return this.athleteRepository.find({
      relations: ['user'],
      order: { lastName: 'ASC' },
    });
  }

  async update(id: string, data: UpdateAthleteData): Promise<Athlete> {
    const athlete = await this.athleteRepository.findOne({ where: { id } });
    if (!athlete) {
      throw new Error('Спортсмен не найден');
    }
    Object.assign(athlete, data);
    return this.athleteRepository.save(athlete);
  }

  async delete(id: string): Promise<void> {
    const result = await this.athleteRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Спортсмен не найден');
    }
  }
}
