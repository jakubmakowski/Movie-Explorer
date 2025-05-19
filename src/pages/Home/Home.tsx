/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCachedFetch } from "../../hooks/useCachedFetch";
import { useDebounce } from "../../hooks/useDebounce";
import { getApiUrl, SEARCH_DELAY } from "../../config";
import lupa from "../../assets/lupa.png";

const staticPosters = [
  "https://m.media-amazon.com/images/M/MV5BMTg2MjkwMTM0NF5BMl5BanBnXkFtZTcwMzc4NDg2NQ@@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BYWRlZjcwYTgtYWJkOS00MGYwLTk3Y2ItNmU4NTg5Nzg2YTQ2XkEyXkFqcGc@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BMjFjYzBlOTktMTI2OS00ZWVhLTgxMDUtNzAwODY2NmI3YTAzXkEyXkFqcGc@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BZjRiMDhiZjQtNjk5Yi00ZDcwLTkyYTEtMDc1NjdmNjFhNGIzXkEyXkFqcGc@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BYmM3MTllNzYtN2MzNS00NWQwLTk0NTEtNjY1MmMwYjNkNTE5XkEyXkFqcGc@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BMTgxOTczODEyMF5BMl5BanBnXkFtZTcwMDc0NDY4Mw@@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BNTg2MDg4MjI5NV5BMl5BanBnXkFtZTcwMzQ0MDczMw@@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BMTU4MjI5NTEyNV5BMl5BanBnXkFtZTcwNjQ1NTMzMg@@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BZDY3OTZiYzktN2U5My00MzRhLWJiZjItZjNlZmM3OGViZmFiXkEyXkFqcGc@._V1_SX300.jpg",
  "https://m.media-amazon.com/images/M/MV5BZTYyMTQ2MDAtMzYzYS00YjZiLWJiNDUtZjEwNzM4YzE1ZDhhXkEyXkFqcGc@._V1_SX300.jpg",
];

const Home = () => {
  const navigate = useNavigate();
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    error,
    infoMessage,
    handleSearch,
    handleKeyPress
  } = useDebounce({
    onSearch: () => {
      setIsSearching(true);
      setTimeout(() => {
        setShouldSearch(true);
      }, SEARCH_DELAY);
    }
  });

  const trimmedSearchTerm = searchTerm.trim();
  const searchUrl = shouldSearch && trimmedSearchTerm.length >= 4
    ? getApiUrl({ s: trimmedSearchTerm, page: '1' })
    : null;

  const { loading, error: fetchError } = useCachedFetch(searchUrl);

  useEffect(() => {
    if (fetchError) {
      setShouldSearch(false);
      setIsSearching(false);
    }
  }, [fetchError]);

  useEffect(() => {
    if (!loading && !fetchError && shouldSearch) {
      localStorage.setItem("lastPage", "1");
      localStorage.setItem("lastSearchTerm", trimmedSearchTerm);
      navigate("/results");
      setShouldSearch(false);
      setIsSearching(false);
    }
  }, [loading, fetchError, shouldSearch, navigate, trimmedSearchTerm]);

  return (
    <div className="home">
      <div className="home__background-overlay" />
      {staticPosters.map((movie) => (
        <img key={movie} src={movie} alt="Movie poster" className="home__poster" />
      ))}
      <div className="home__modal">
        <h1 className="home__title">Podaj nazwę filmu, aby rozpocząć wyszukiwanie</h1>
        <img className="home__icon" src={lupa} alt="Search icon" />
        <form className="home__form" onSubmit={(e) => e.preventDefault()}>
          <div className="home__search-container">
            <input
              type="text"
              placeholder="Wyszukiwanie filmów po tytule"
              className="home__input"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="home__search-button"
              onClick={handleSearch}
              disabled={isSearching || loading || trimmedSearchTerm.length < 4}
            >
              {isSearching || loading ? 'Szukam...' : 'Szukaj'}
            </button>
          </div>
          <div className={`home__spinner ${isSearching || loading ? 'active' : ''}`} />
          {error && <p className="home__error">{error}</p>}
          {infoMessage && <p className="home__info">{infoMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Home;
