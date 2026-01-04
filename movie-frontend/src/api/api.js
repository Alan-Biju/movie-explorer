import axios from "axios";

const BASE_URL = "http://localhost:8000";

export function getMovies(params) {
  return axios.get(`${BASE_URL}/movies`, {
    params: params,
  });
}

export function getMovieDetails(id) {
  return axios.get(`${BASE_URL}/movies/${id}`);
}

export function getActors() {
  return axios.get(`${BASE_URL}/actors`);
}

export function getGenres() {
  return axios.get(`${BASE_URL}/genres`);
}

export function getDirectors() {
  return axios.get(`${BASE_URL}/directors`);
}
