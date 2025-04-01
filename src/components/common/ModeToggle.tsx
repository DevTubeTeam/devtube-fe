import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks';
import { Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
