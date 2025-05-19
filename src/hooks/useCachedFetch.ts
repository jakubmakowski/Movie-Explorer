/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useApi } from "../context";
import type { Movie } from "../context";

interface CacheEntry {
  data: Movie[];
  totalResults: number;
  timestamp: number;
}

interface OMDBResponse {
  Response: string;
  Search: Movie[];
  totalResults: string;
  Error?: string;
}

const CACHE_EXPIRATION = 5 * 60 * 1000;
const CACHE_KEY = 'omdb_current_page';

const getCache = (): CacheEntry | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  const parsed = JSON.parse(cached) as CacheEntry;
  if (Date.now() - parsed.timestamp > CACHE_EXPIRATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  
  return parsed;
};

const setCache = (data: CacheEntry) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export const useCachedFetch = (url: string | null) => {
  const { setMovies } = useApi();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [fetchedMovies, setFetchedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;

      const searchTerm = url.split('s=')[1]?.split('&')[0];
      const page = url.split('page=')[1];
      if (!searchTerm || searchTerm.length < 4) return;

      const cached = getCache();
      const currentPage = localStorage.getItem('lastPage');

      if (cached && currentPage === page) {
        setMovies(cached.data);
        setFetchedMovies(cached.data);
        setTotalResults(cached.totalResults);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get<OMDBResponse>(url);

        if (response.data.Response === "True") {
          const totalResults = Number(response.data.totalResults);
          
          const cacheEntry: CacheEntry = {
            data: response.data.Search,
            totalResults,
            timestamp: Date.now()
          };
          setCache(cacheEntry);
          
          setMovies(response.data.Search);
          setFetchedMovies(response.data.Search);
          setTotalResults(totalResults);
          setError(null);
        } else {
          setError(response.data.Error || "Błąd podczas pobierania danych");
        }
      } catch {
        setError("Błąd sieci lub serwera");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, setMovies]);

  return { error, loading, totalResults, movies: fetchedMovies };
};