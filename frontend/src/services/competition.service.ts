import { apiService } from './api.service';
import { Competition, CreateCompetitionData } from '../types/competition.types';

class CompetitionService {
  async createCompetition(data: CreateCompetitionData): Promise<Competition> {
    return apiService.post<Competition>('/competitions', data);
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return apiService.get<Competition[]>('/competitions');
  }

  async getCompetitionById(id: string): Promise<Competition> {
    return apiService.get<Competition>(`/competitions/${id}`);
  }

  async updateCompetition(
    id: string,
    data: Partial<CreateCompetitionData>
  ): Promise<Competition> {
    return apiService.patch<Competition>(`/competitions/${id}`, data);
  }

  async deleteCompetition(id: string): Promise<void> {
    return apiService.delete(`/competitions/${id}`);
  }
}

export const competitionService = new CompetitionService();
