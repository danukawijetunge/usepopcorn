import { useEffect, useState, useRef } from "react";
import StarRating from "./StartRating";
import userEvent from "@testing-library/user-event";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

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

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
// stateless component
function WatchList({ watched, onDeleteWatchMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatchMovie={onDeleteWatchMovie}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onDeleteWatchMovie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <sapn>🌟</sapn>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>🕥</span>
          <spa>{movie.Runtime} min</spa>
        </p>
        <button
          value={movie.imdbID}
          onClick={(e) => onDeleteWatchMovie(e.target.value)}
          className="btn-delete"
        >
          X
        </button>
      </div>
    </li>
  );
}
// stateless component
function Movie({ movie, onSelectedMovie }) {
  console.log("Movie component ", typeof onSelectedMovie);

  return (
    <li key={movie.imdbID} onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
// state full component
function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
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

function Search({ query, setQuery }) {
  console.log("Search is rendering SEARRCH");
  const inputEl = useRef(null);

  // This is not the way to write in react
  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, [query]);

  // useEffect(() => {
  //   function callback(e) {
  //     console.log(`event type ${e.code}`);

  //     if (e.code === "Enter") {
  //       //inputEl.current.value useKey= "";
  //       setQuery(inputEl.current.value);
  //       inputEl.current.focus();
  //     }
  //   }

  //   document.addEventListener("keydown", callback);

  //   return function () {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, []);

  useKey("Enter", () => {
    setQuery(inputEl.current.value);
    inputEl.current.focus();
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = "443cf5ab";

export default function App() {
  console.log("RENDING APP");

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

  // useEffect(() => {
  //   document.addEventListener("keydown", function (e) {
  //     handleCloseMovie();
  //   });
  // }, []);

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

function Loader() {
  return <p className="loader"> Loading...</p>;
}

function Error({ message }) {
  return <p className="error">{message}</p>;
}

function MovieDetail({ onSelectedMovieId, onCloseMovie, onWatchMovie }) {
  const [movie, setMovie] = useState({});
  const [movieRating, setMovieRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const counterRef = useRef(0);

  const {
    Title,
    Year,
    Poster,
    Runtime,
    Plot,
    imdbRating,
    Released,
    Actors,
    Director,
    Genre,
  } = movie;

  console.log(`Rendering the component before 1 useEffiect ${movie.Title}`);

  // states has to be in top level otherwise the order will change
  // if (imdbRating > 4) {
  //   const [top8, setTop8] = useState(0);
  // }

  console.log(`IMDB rating ${imdbRating}`);

  // const [top, setTop] = useState(false);
  const [avgRate, setAvgrate] = useState(0);

  function handleAddtoList() {
    let newWatchMovies = {
      ...movie,
      imdbRating: Number(imdbRating),
      Runtime: Number(Runtime.split(" ").at(0)),
      userRating: Number(movieRating),
      countRatingDecisions: counterRef.current,
    };

    onWatchMovie(newWatchMovies);

    // console.log(`imdbRating ${imdbRating}`);

    // setAvgrate((imdbRating + Number(newWatchMovies.userRating)) / 2);

    onCloseMovie();
  }

  // useEffect(
  //   function () {
  //     setTop(imdbRating > 6);
  //   },
  //   [imdbRating]
  // );

  // useEffect(() => {
  //   function callback(e) {
  //     if (e.code === "Escape") {
  //       onCloseMovie();
  //       console.log("CLOSING...");
  //     }
  //   }

  //   document.addEventListener("keydown", callback);

  //   return function () {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, [onCloseMovie]);

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function findSelectedMovie(onSelectedMovieId) {
      setIsLoading(true);
      try {
        let response = await fetch(
          `https://www.omdbapi.com/?i=${onSelectedMovieId}&apikey=${API_KEY}`
        );
        let data = await response.json();
        setMovie(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      } finally {
      }
    }

    findSelectedMovie(onSelectedMovieId);
  }, [onSelectedMovieId]);

  console.log(`Rendering the component before 2 useEffiect ${movie.Title}`);

  useEffect(() => {
    document.title = `Movie | ${movie.Title}`;

    return function () {
      document.title = `usePopcorn`;
      // console.log(`Cleanup method was called for movie ${movie.Title}`);
    };
  }, [movie.Title]);

  useEffect(() => {
    counterRef.current = counterRef.current + 1;
  }, [movieRating]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            {/* <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button> */}
            <img src={Poster} alr={`Poster of the ${movie} movie`} />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐</span> <p> {imdbRating} IMDB rating</p>
              </p>
            </div>
          </header>
          <h1>Checking{avgRate}</h1>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setMovieRating}
              />
              {movieRating > 0 && (
                <button className="btn-add" onClick={handleAddtoList}>
                  Add to List
                </button>
              )}
            </div>
            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
