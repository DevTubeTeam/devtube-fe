import { ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  const applyTheme = (next: ThemeType) => {
    setThemeState(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(next);
  };

  const setTheme = (next: ThemeType) => {
    applyTheme(next);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeType | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored);
    } else {
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
