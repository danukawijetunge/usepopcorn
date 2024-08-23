import { useEffect, useRef, useState } from "react";
import { useKey } from "./useKey";
import StarRating from "./StartRating";
import Loader from "./Loader";
import { API_KEY } from "./Constant";

export default function MovieDetail({
  onSelectedMovieId,
  onCloseMovie,
  onWatchMovie,
}) {
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
    onCloseMovie();
  }

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
