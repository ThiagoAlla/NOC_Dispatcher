import { db } from '../database';

export const settingsRepository = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    const item = await db.settings.get(key);
    return item ? (item.value as T) : defaultValue;
  },

  async set<T>(key: string, value: T): Promise<string> {
    return db.settings.put({
      key,
      value,
      updatedAt: new Date().toISOString()
    });
  },

  async addRecentChip(key: 'recent_cities' | 'recent_pops', value: string): Promise<string[]> {
    if (!value || !value.trim()) {
      return this.get<string[]>(key, []);
    }
    const clean = value.trim();
    const current = await this.get<string[]>(key, []);
    const updated = [clean, ...current.filter((c) => c !== clean)].slice(0, 8);
    await this.set(key, updated);
    return updated;
  }
};
