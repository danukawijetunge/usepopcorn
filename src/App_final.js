import { useEffect, useState, useRef } from "react";
import StarRating from "./StartRating";
import userEvent from "@testing-library/user-event";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
import Search from "./Search";
import Loader from "./Loader";
import Logo from "./Logo";
import Movie from "./Movie";
import Summary from "./Summary";
import MovieList from "./MovieList";
import WatchList from "./WatchList";
import MovieDetail from "./MovieDetail";

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

//Structural component
function Main({ children }) {
  return <main className="main">{children}</main>;
}
// Structural component
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

export default function App() {
  const [watched, setWatched] = useLocalStorageState("watched");

  const [movieRating, setMovieRating] = useState(0);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [movieDetail, setMovieDetail] = useState(null);
  const [closeMovieDetail, setCloseMovieDetail] = useState(null);

  function handleCloseMovie() {
    setSelectedId(null);
  }

  async function handleSelectedMovie(selectedMoviesId) {
    setSelectedId((prev) =>
      prev === selectedMoviesId ? setSelectedId(null) : selectedMoviesId
    );
  }

  function handleWatchedMovie(movie) {
    console.log(`handlewatchmovies ${JSON.stringify(movie)}`);

    let refineList = watched.filter(
      (element) => element.imdbID != movie.imdbID
    );

    setWatched((prevMovies) => [...refineList, movie]);
  }

  function handleDeleteWatchMovie(id) {
    setWatched((prevMovies) => [
      ...prevMovies.filter((element) => element.imdbID != id),
    ]);
  }

  const { movies, isLoading } = useMovies(query);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      {/* {error.length > 0 && <Error message={error} />} */}
      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetail
              onSelectedMovieId={selectedId}
              onCloseMovie={handleCloseMovie}
              onWatchMovie={handleWatchedMovie}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchList
                watched={watched}
                onDeleteWatchMovie={handleDeleteWatchMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
