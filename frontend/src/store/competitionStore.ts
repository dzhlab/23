import { create } from 'zustand';
import { Competition, CreateCompetitionData } from '../types/competition.types';
import { competitionService } from '../services/competition.service';
import { toast } from 'react-toastify';

interface CompetitionState {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  isLoading: boolean;
  error: string | null;

  fetchCompetitions: () => Promise<void>;
  fetchCompetitionById: (id: string) => Promise<void>;
  createCompetition: (data: CreateCompetitionData) => Promise<void>;
  updateCompetition: (id: string, data: Partial<CreateCompetitionData>) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCompetitionStore = create<CompetitionState>((set) => ({
  competitions: [],
  selectedCompetition: null,
  isLoading: false,
  error: null,

  fetchCompetitions: async () => {
    set({ isLoading: true, error: null });
    try {
      const competitions = await competitionService.getAllCompetitions();
      set({ competitions, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Ошибка загрузки соревнований';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchCompetitionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const competition = await competitionService.getCompetitionById(id);
      set({ selectedCompetition: competition, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Ошибка загрузки соревнования';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createCompetition: async (data: CreateCompetitionData) => {
    set({ isLoading: true, error: null });
    try {
      const competition = await competitionService.createCompetition(data);
      set((state) => ({
        competitions: [competition, ...state.competitions],
        isLoading: false,
      }));
      toast.success('Соревнование создано успешно');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Ошибка создания соревнования';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateCompetition: async (id: string, data: Partial<CreateCompetitionData>) => {
    set({ isLoading: true, error: null });
    try {
      const competition = await competitionService.updateCompetition(id, data);
      set((state) => ({
        competitions: state.competitions.map((c) => (c.id === id ? competition : c)),
        selectedCompetition: state.selectedCompetition?.id === id ? competition : state.selectedCompetition,
        isLoading: false,
      }));
      toast.success('Соревнование обновлено успешно');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Ошибка обновления соревнования';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteCompetition: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await competitionService.deleteCompetition(id);
      set((state) => ({
        competitions: state.competitions.filter((c) => c.id !== id),
        selectedCompetition: state.selectedCompetition?.id === id ? null : state.selectedCompetition,
        isLoading: false,
      }));
      toast.success('Соревнование удалено успешно');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Ошибка удаления соревнования';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
