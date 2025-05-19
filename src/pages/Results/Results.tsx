/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTheme } from "../../context";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../context";
import { useCachedFetch } from "../../hooks/useCachedFetch";
import { getApiUrl } from "../../config";

const Results = () => {
  const {  theme, toggleTheme } = useTheme();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const searchTerm = localStorage.getItem("lastSearchTerm") || "";
  const savedPage = Number(localStorage.getItem("lastPage")) || 1;
  const [currentPage, setCurrentPage] = useState(savedPage);
  const navigate = useNavigate();

  const searchUrl = searchTerm
    ? getApiUrl({ s: searchTerm, page: currentPage.toString() })
    : null;

  const { loading, error, totalResults, movies } = useCachedFetch(searchUrl);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteMovies");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastPage", currentPage.toString());
  }, [currentPage]);

  const totalPages = Math.ceil(totalResults / 10);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const back = () => {
    navigate("/");
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    } else {
      updatedFavorites = [...favorites, movie];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  };

  if (loading) {
    return (
      <div className={`results ${theme}`}>
        <div className="results__belt">
          <button onClick={back}>
            Wyszukiwarka
          </button>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Tryb jasny' : 'Tryb ciemny'}
          </button>
          <button onClick={() => navigate("/favorites")}>
            Ulubione
          </button>
        </div>
        <div className="results__wrapper">
          <div className="results__loading">Ładowanie wyników...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`results ${theme}`}>
        <div className="results__belt">
          <button onClick={back}>
            Wyszukiwarka
          </button>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Tryb jasny' : 'Tryb ciemny'}
          </button>
          <button onClick={() => navigate("/favorites")}>
            Ulubione
          </button>
        </div>
        <div className="results__wrapper">
          <div className="results__error">Błąd: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`results ${theme}`}>
      <div className="results__belt">
        <button onClick={back}>
          Wyszukiwarka
        </button>
        <button onClick={toggleTheme}>
          {theme === "light" ? "Tryb ciemny" : "Tryb jasny"}
        </button>
        <button onClick={() => navigate("/favorites")}>
          Ulubione
        </button>
      </div>
      <div className="results__wrapper">
        <h1 className="results__title">
          Wyniki wyszukiwania dla: <strong className="results__value">{searchTerm}</strong>
        </h1>
        <div className={`results__grid ${loading ? 'loading' : ''}`}>
          {movies.map((movie) => (
            <div key={movie.imdbID} className="results__item">
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.jpg"}
                alt={movie.Title}
              />
              <h2>{movie.Title}</h2>
              <p>{movie.Year}</p>
              <button 
                className={`results__favorite ${isFavorite(movie.imdbID) ? 'active' : ''}`}
                onClick={() => toggleFavorite(movie)}
              >
                {isFavorite(movie.imdbID) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              </button>
            </div>
          ))}
        </div>
        <div className={`results__pagination ${loading ? 'loading' : ''}`}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Poprzednia
          </button>
          <span>
            Strona {currentPage} z {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Następna
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
