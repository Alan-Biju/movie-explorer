import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getActors, getGenres, getDirectors } from "../api/api";
import "./Filters.scss";

function Filters() {
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);

  const [actorQuery, setActorQuery] = useState("");
  const [directorQuery, setDirectorQuery] = useState("");

  const [showActorDropdown, setShowActorDropdown] = useState(false);
  const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const actorInputRef = useRef(null);
  const directorInputRef = useRef(null);

  useEffect(() => {
    getActors().then((res) => setActors(res.data));
    getGenres().then((res) => setGenres(res.data));
    getDirectors().then((res) => setDirectors(res.data))
  }, []);

  useEffect(() => {
    const actorId = searchParams.get("actor_id");
    const directorId = searchParams.get("director_id");

    if (actorId && actors.length) {
      const actor = actors.find((item) => item.id === actorId);
      setActorQuery(actor ? actor.name : "");
    } else {
      setActorQuery("");
    }

    if (directorId && directors.length) {
      const director = directors.find((item) => item.id === directorId);
      setDirectorQuery(director ? director.name : "");
    } else {
      setDirectorQuery("")
    }
  }, [searchParams, actors, directors]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());

    if (value) {
      params[key] = value;
    } else {
      delete params[key]
    }

    delete params.page;
    setSearchParams(params);
  };

  const filteredActors = actors.filter((a) =>
    a.name.toLowerCase().includes(actorQuery.toLowerCase()),
  );

  const filteredDirectors = directors.filter((d) =>
    d.name.toLowerCase().includes(directorQuery.toLowerCase()),
  );

  return (
    <div className="filters">
      <div className="autocomplete">
        <input
          ref={actorInputRef}
          type="text"
          placeholder="Search actor..."
          value={actorQuery}
          onChange={(e) => {
            const value = e.target.value;
            setActorQuery(value);
            setShowActorDropdown(true);

            if (!value) {
              updateParam("actor_id", null)
              setShowActorDropdown(false);
            }
          }}
          onFocus={() => setShowActorDropdown(true)}
        />

        {showActorDropdown && actorQuery && (
          <ul className="dropdown">
            {filteredActors.length ? (
              filteredActors.map((actor) => (
                <li
                  key={actor.id}
                  onClick={() => {
                    updateParam("actor_id", actor.id);
                    setActorQuery(actor.name);
                    setShowActorDropdown(false);
                  }}
                >
                  {actor.name}
                </li>
              ))
            ) : (
              <li className="no-result">No actor found</li>
            )}
          </ul>
        )}
      </div>

      <div className="autocomplete">
        <input
          ref={directorInputRef}
          type="text"
          placeholder="search director"
          value={directorQuery}
          onChange={(e) => {
            const value = e.target.value;
            setDirectorQuery(value);
            setShowDirectorDropdown(true);

            if (!value) {
              updateParam("director_id", null);
              setShowDirectorDropdown(false);
            }
          }}
          onFocus={() => setShowDirectorDropdown(true)}
        />

        {showDirectorDropdown && directorQuery && (
          <ul className="dropdown">
            {filteredDirectors.length ? (
              filteredDirectors.map((director) => (
                <li
                  key={director.id}
                  onClick={() => {
                    updateParam("director_id", director.id);
                    setDirectorQuery(director.name);
                    setShowDirectorDropdown(false);
                  }}
                >
                  {director.name}
                </li>
              ))
            ) : (
              <li className="no-result">No directors found</li>
            )}
          </ul>
        )}
      </div>

      <select
        value={searchParams.get("genre_id") || ""}
        onChange={(e) => updateParam("genre_id", e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
