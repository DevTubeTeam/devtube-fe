// storageUtil.ts

export const storageUtil = {
  set<T>(key: string, value: T): void {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (error) {
      console.error(`Error setting ${key} in localStorage`, error);
    }
  },

  get<T>(key: string): T | null {
    try {
      const json = localStorage.getItem(key);
      return json ? (JSON.parse(json) as T) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage`, error);
      return null;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage`, error);
    }
  },

  clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },
};
