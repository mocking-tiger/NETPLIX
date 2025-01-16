import styled from "styled-components";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getMovieSearchResults,
  getTvSearchResults,
  IGetMovieResult,
} from "../api";
import { Loader } from "./Home";
import { makeImagePath } from "../utils";
import { useEffect } from "react";
import MovieModalComponent from "../components/MovieModal";

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

const ResultItem = styled.li`
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

// 스타일드 컴포넌트 영역 끝

export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const selectedStuff = searchParams.get("movieId");
  const navigate = useNavigate();
  const {
    data: movieResults,
    isLoading,
    refetch: refetchMovie,
  } = useQuery<IGetMovieResult>(["results", "movie"], () =>
    getMovieSearchResults(keyword ?? "")
  );

  const { data: tvResults, refetch: refetchTv } = useQuery<IGetMovieResult>(
    ["results", "tv"],
    () => getTvSearchResults(keyword ?? "")
  );

  const onOverlayClick = () => navigate(`/search?keyword=${keyword}`);

  const onBoxClicked = (movieId: number) => {
    navigate(`/search?keyword=${keyword}&movieId=${movieId}`);
  };

  const clickedMovie = movieResults?.results
    .concat(tvResults ? tvResults?.results : [])
    .find((stuff) => String(stuff.id) === selectedStuff);

  useEffect(() => {
    if (keyword) {
      refetchMovie();
      refetchTv();
    }
  }, [keyword, refetchMovie, refetchTv]);

  console.log(movieResults);
  console.log(tvResults);
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
          </MovieResult>
          <TvResult>
            <h2>TV시리즈 검색결과 {tvResults?.total_results ?? 0}건</h2>
            <ResultList>
              {tvResults?.results.map((show) => (
                <ResultItem key={show.id} onClick={() => onBoxClicked(show.id)}>
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
