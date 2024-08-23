import WatchedMovie from "./WatchedMovie";

// stateless component
export default function WatchList({ watched, onDeleteWatchMovie }) {
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
