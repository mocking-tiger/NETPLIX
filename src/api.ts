const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  name: string;
  vote_average: number;
  original_name: string;
  original_title: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMoviesNowPlaying() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getMoviesPopular() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getMoviesTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getMoviesUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getTvTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getTvPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getTvOnTheAir() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getTvAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getMovieSearchResults(keyword: string, page = 1) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&include_adult=true&language=ko&page=${page}`
  ).then((response) => response.json());
}

export function getTvSearchResults(keyword: string, page = 1) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}&include_adult=true&language=ko&page=${page}`
  ).then((response) => response.json());
}
