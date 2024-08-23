export default function WatchedMovie({ movie, onDeleteWatchMovie }) {
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
