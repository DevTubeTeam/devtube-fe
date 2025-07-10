// storageUtil.ts

export const storageUtil = {
  set<T>(key: string, value: T, days = 7): void {
    try {
      const json = encodeURIComponent(JSON.stringify(value));
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${key}=${json}; expires=${expires}; path=/`;
    } catch (error) {
      console.error(`Error setting ${key} in cookies`, error);
    }
  },

  get<T>(key: string): T | null {
    try {
      const match = document.cookie.match(
        new RegExp('(?:^|; )' + key.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
      );
      if (!match) {
        return null;
      }
      const value = JSON.parse(decodeURIComponent(match[1])) as T;
      return value;
    } catch (error) {
      console.error(`Error getting ${key} from cookies`, error);
      return null;
    }
  },

  remove(key: string): void {
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    } catch (error) {
      console.error(`Error removing ${key} from cookies`, error);
    }
  },

  clearAll(): void {
    try {
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        }
      });
    } catch (error) {
      console.error('Error clearing cookies', error);
    }
  },
};
