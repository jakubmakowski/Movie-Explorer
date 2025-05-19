import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
}

interface APIContextType {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

const APIContext = createContext<APIContextType | undefined>(undefined);

interface APIContextProviderProps {
  children: ReactNode;
}

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AppProvider = ({ children }: APIContextProviderProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <APIContext.Provider value={{ movies, setMovies }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </APIContext.Provider>
  );
};

export function useApi() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error('useAPI must be used within an AppProvider');
  }
  return context;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an AppProvider');
  }
  return context;
}