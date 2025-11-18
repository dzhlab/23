import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Competition } from '../entities/Competition.entity';
import { CreateCompetitionData, UpdateCompetitionData } from '../types/competition.types';

/**
 * Сервис для работы с соревнованиями
 */
export class CompetitionService {
  private competitionRepository: Repository<Competition>;

  constructor() {
    this.competitionRepository = AppDataSource.getRepository(Competition);
  }

  async create(data: CreateCompetitionData, organizerId: string): Promise<Competition> {
    const competition = this.competitionRepository.create({
      ...data,
      organizerId,
    });
    return this.competitionRepository.save(competition);
  }

  async findById(id: string): Promise<Competition | null> {
    return this.competitionRepository.findOne({
      where: { id },
      relations: ['organizer', 'chiefJudge'],
    });
  }

  async findAll(): Promise<Competition[]> {
    return this.competitionRepository.find({
      relations: ['organizer', 'chiefJudge'],
      order: { startDate: 'DESC' },
    });
  }

  async update(id: string, data: UpdateCompetitionData): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({ where: { id } });
    if (!competition) {
      throw new Error('Соревнование не найдено');
    }
    Object.assign(competition, data);
    return this.competitionRepository.save(competition);
  }

  async delete(id: string): Promise<void> {
    const result = await this.competitionRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Соревнование не найдено');
    }
  }
}
