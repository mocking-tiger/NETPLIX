import styled from "styled-components";
import MovieModalComponent from "../components/MovieModal";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "./Home";
import { makeImagePath } from "../utils";
import { MouseEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getMovieSearchResults,
  getTvSearchResults,
  IGetMovieResult,
} from "../api";

const Wrapper = styled.div`
  min-height: calc(100vh - 100px);
  padding-top: 70px;
  padding-bottom: 100px;
`;

const Results = styled.div`
  padding: 20px 60px;
`;

const MovieResult = styled.div`
  margin-bottom: 100px;
  h2 {
    font-size: 36px;
    margin-bottom: 10px;
  }
`;

const TvResult = styled.div`
  h2 {
    font-size: 36px;
    margin-bottom: 10px;
  }
`;

const ResultList = styled.ul`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ResultItem = styled(motion.li)`
  width: 250px;
  height: 400px;
  cursor: pointer;
  user-select: none;

  div {
    width: 250px;
    height: 350px;
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
  }
  h3 {
    height: 50px;
    margin-top: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Button = styled.button`
  margin-right: 10px;
  background-color: transparent;
  color: white;
  font-size: 24px;
  cursor: pointer;
  border: none;
  border-bottom: 2px solid transparent;

  &:hover {
    border-bottom: 2px solid white;
    transition: border-bottom 0.3s ease-in-out;
  }
`;

// 스타일드 컴포넌트 영역 끝

export default function Search() {
  const STUFFS_PER_PAGE = 20;
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const selectedStuff = searchParams.get("movieId");
  const navigate = useNavigate();

  const {
    data: movieResults,
    isLoading,
    refetch: refetchMovie,
  } = useQuery<IGetMovieResult>(["results", "movie"], () =>
    getMovieSearchResults(keyword ?? "", movieIndex)
  );

  const { data: tvResults, refetch: refetchTv } = useQuery<IGetMovieResult>(
    ["results", "tv"],
    () => getTvSearchResults(keyword ?? "", tvIndex)
  );

  const [movieIndex, setMovieIndex] = useState(1);
  const [tvIndex, setTvIndex] = useState(1);

  const onOverlayClick = () => navigate(`/search?keyword=${keyword}`);

  const onBoxClicked = (movieId: number) => {
    navigate(`/search?keyword=${keyword}&movieId=${movieId}`);
  };

  const clickedMovie = movieResults?.results
    .concat(tvResults ? tvResults?.results : [])
    .find((stuff) => String(stuff.id) === selectedStuff);

  const setIndex = (event: MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    if (movieResults && tvResults) {
      const maximumMoviePage = Math.ceil(
        movieResults?.total_results / STUFFS_PER_PAGE
      );
      const maximumTvPage = Math.ceil(
        tvResults?.total_results / STUFFS_PER_PAGE
      );

      if (target.name === "m-") {
        setMovieIndex((prev) => (prev === 1 ? 1 : prev - 1));
      } else if (target.name === "m+") {
        setMovieIndex((prev) =>
          prev === maximumMoviePage ? maximumMoviePage : prev + 1
        );
      } else if (target.name === "t-") {
        setTvIndex((prev) => (prev === 1 ? 1 : prev - 1));
      } else {
        setTvIndex((prev) =>
          prev === maximumTvPage ? maximumTvPage : prev + 1
        );
      }
    }
    // console.log(target.name);
  };

  useEffect(() => {
    if (keyword) {
      refetchMovie();
      refetchTv();
    }
  }, [keyword, refetchMovie, refetchTv, movieIndex, tvIndex]);

  // console.log(movieResults);
  // console.log(tvResults);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <Results>
          <MovieResult>
            <h2>영화 검색결과 {movieResults?.total_results ?? 0}건</h2>
            <ResultList>
              {movieResults?.results.map((movie) => (
                <ResultItem
                  key={movie.id}
                  layoutId={`-${movie.id}`}
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <div
                    style={{
                      backgroundImage: `url(${makeImagePath(
                        movie.poster_path
                      )})`,
                    }}
                  />
                  <h3>{movie.title}</h3>
                </ResultItem>
              ))}
            </ResultList>
            <Button name="m-" onClick={setIndex}>
              {"<< Prev"}
            </Button>
            <Button name="m+" onClick={setIndex}>
              {"Next >>"}
            </Button>
          </MovieResult>
          <TvResult>
            <h2>TV시리즈 검색결과 {tvResults?.total_results ?? 0}건</h2>
            <ResultList>
              {tvResults?.results.map((show) => (
                <ResultItem
                  key={show.id}
                  layoutId={`-${show.id}`}
                  onClick={() => onBoxClicked(show.id)}
                >
                  <div
                    style={{
                      backgroundImage: `url(${makeImagePath(
                        show.poster_path
                      )})`,
                    }}
                  />
                  <h3>{show.name}</h3>
                </ResultItem>
              ))}
            </ResultList>
            <Button name="t-" onClick={setIndex}>
              {"<< Prev"}
            </Button>
            <Button name="t+" onClick={setIndex}>
              {"Next >>"}
            </Button>
          </TvResult>
        </Results>
      )}
      <MovieModalComponent
        bigMovieMatch={selectedStuff}
        onOverlayClick={onOverlayClick}
        clickedMovie={clickedMovie}
        title=""
      />
    </Wrapper>
  );
}
