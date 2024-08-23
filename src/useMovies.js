import { useState, useEffect } from "react";
import { API_KEY } from "./Constant";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controler = new AbortController();

    async function fetchMovies() {
      setIsLoading(true);
      setError("");

      try {
        let res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
          { signal: controler.signal }
        );

        if (!res.ok) {
          throw new Error(
            "Something has been gone wrong during fetching movies from the api"
          );
        }
        let data = await res.json();

        if (data.Response === "False") {
          throw new Error("Cann't find the movie");
        }
        setMovies(data.Search);
        console.log(data.Search);
        setIsLoading(false);
      } catch (e) {
        setError(e.message);
        console.log("catch block", e);
      } finally {
        setIsLoading(false);
      }

      return function () {
        controler.abort();
      };
    }
    if (query.length > 3) {
      fetchMovies();
    } else {
      setMovies([]);
      setIsLoading(false);
      setError("");
    }
  }, [query]);

  return { movies, error, isLoading };
}
