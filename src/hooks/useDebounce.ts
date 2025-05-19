import { useEffect, useRef, useState } from 'react';

interface UseDebounceOptions {
  delay?: number;
  onSearch?: () => void;
}

interface UseDebounceReturn {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  error: string | null;
  infoMessage: string;
  isLoading: boolean;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const useDebounce = (options: UseDebounceOptions = {}): UseDebounceReturn => {
  const { delay = 500, onSearch } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const trimmedSearchTerm = searchTerm.trim();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!searchTerm || trimmedSearchTerm.length < 4) {
        setError(null);
        setIsLoading(false);

        if (searchTerm && trimmedSearchTerm.length > 0) {
          setInfoMessage("Wpisz co najmniej 4 znaki, aby rozpocząć wyszukiwanie");
        } else {
          setInfoMessage("");
        }
      } else {
        setInfoMessage("");
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, trimmedSearchTerm, delay]);

  const handleSearch = () => {
    if (trimmedSearchTerm.length < 4) {
      setError("Wpisz co najmniej 4 znaki, aby rozpocząć wyszukiwanie");
      return;
    }
    setIsLoading(true);
    onSearch?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    error,
    infoMessage,
    isLoading,
    handleSearch,
    handleKeyPress
  };
}; 