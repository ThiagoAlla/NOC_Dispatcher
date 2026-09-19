import { create } from 'zustand';
import { settingsRepository } from '../db/repositories/settingsRepository';

interface SettingsState {
  recentCities: string[];
  recentPops: string[];
  defaultOperator: string;
  isLoaded: boolean;

  loadSettings: () => Promise<void>;
  addRecentCity: (city: string) => Promise<void>;
  addRecentPop: (pop: string) => Promise<void>;
  setDefaultOperator: (operator: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  recentCities: [],
  recentPops: [],
  defaultOperator: '',
  isLoaded: false,

  loadSettings: async () => {
    const cities = await settingsRepository.get<string[]>('recent_cities', []);
    const pops = await settingsRepository.get<string[]>('recent_pops', []);
    const operator = await settingsRepository.get<string>('default_operator', '');

    set({
      recentCities: cities,
      recentPops: pops,
      defaultOperator: operator,
      isLoaded: true,
    });
  },

  addRecentCity: async (city: string) => {
    const updated = await settingsRepository.addRecentChip('recent_cities', city);
    set({ recentCities: updated });
  },

  addRecentPop: async (pop: string) => {
    const updated = await settingsRepository.addRecentChip('recent_pops', pop);
    set({ recentPops: updated });
  },

  setDefaultOperator: async (operator: string) => {
    await settingsRepository.set('default_operator', operator);
    set({ defaultOperator: operator });
  },
}));
