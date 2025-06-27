import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchInputProps {
  className?: string;
  placeholder?: string;
}

const SearchInput = ({ className, placeholder = 'Search videos...' }: SearchInputProps) => {
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="pl-9 w-full"
        aria-label="Search"
      />
    </form>
  );
};

export default SearchInput;
