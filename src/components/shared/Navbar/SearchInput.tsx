import { InputWithIcon } from '@/components/ui/input/InputWithIcon';
import { Search } from 'lucide-react';
import * as React from 'react';

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchInput = ({
  className,
  placeholder = 'Search videos...',
  onSearch,
}: SearchInputProps) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <InputWithIcon
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
        className="w-full"
        aria-label="Search"
      />
    </form>
  );
};

export default SearchInput;
