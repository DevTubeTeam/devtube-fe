import { cn } from '@/utils';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      to="/"
      className={cn(
        'flex items-center gap-2 font-bold text-primary',
        className,
      )}
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
        <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
      </div>
      <span className="text-xl">DevHub</span>
    </Link>
  );
};

export default Logo;
