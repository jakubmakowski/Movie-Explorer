import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context";
import type { Movie } from "../../context";

const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteMovies");
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      setFavorites(parsedFavorites);
    }
    setIsLoading(false);
  }, []);

  const removeFromFavorites = (imdbID: string) => {
    const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbID);
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
  };

  const back = () => {
    navigate("/");
  };

  const last = () => {
    navigate("/results");
  };

  return (
    <div className={`favorites ${theme}`}>
      <div className="favorites__belt">
        <button onClick={back}>
          Wyszukiwarka
        </button>
        <button onClick={toggleTheme} className="favorites__theme-toggle">
          {theme === 'light' ?  'Tryb ciemny' : 'Tryb jasny'}
        </button>
        <button onClick={last}>Ostatnie</button>
      </div>
      <div className="favorites__wrapper">
        <h1 className="favorites__title">Ulubione filmy</h1>
        {isLoading ? (
          <div className="favorites__loading">Ładowanie...</div>
        ) : favorites.length === 0 ? (
          <div className="favorites__empty">Nie masz jeszcze ulubionych filmów</div>
        ) : (
          <div className="favorites__grid">
            {favorites.map((movie) => (
              <div key={movie.imdbID} className="favorites__item">
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.jpg"}
                  alt={movie.Title}
                />
                <h2>{movie.Title}</h2>
                <p>{movie.Year}</p>
                <button
                  className="favorites__remove"
                  onClick={() => removeFromFavorites(movie.imdbID)}
                >
                  Usuń z ulubionych
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
