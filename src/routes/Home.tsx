import styled from "styled-components";
import Slider from "../components/Slider";
import { useQuery } from "react-query";
import {
  getMoviesNowPlaying,
  getMoviesPopular,
  getMoviesTopRated,
  getMoviesUpcoming,
  IGetMovieResult,
} from "../api";
import { makeImagePath } from "../utils";

export const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;

  div:last-child {
    margin-bottom: 20px;
  }
`;

export const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 68px;
  position: relative;
  bottom: -130px;
`;

export const Overview = styled.p`
  width: 50%;
  font-size: 24px;
  position: relative;
  bottom: -130px;
`;

// 스타일드 컴포넌트 영역 끝

export default function Home() {
  const { data: nowPlaying, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMoviesNowPlaying
  );

  const { data: popular } = useQuery<IGetMovieResult>(
    ["movies", "popular"],
    getMoviesPopular
  );

  const { data: topRated } = useQuery<IGetMovieResult>(
    ["movies", "topRated"],
    getMoviesTopRated
  );

  const { data: Upcoming } = useQuery<IGetMovieResult>(
    ["movies", "Upcoming"],
    getMoviesUpcoming
  );

  // console.log(clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>
          <Slider data={nowPlaying} title="Now Playing" />
          <Slider data={popular} title="Popular" />
          <Slider data={topRated} title="Top Rated" />
          <Slider data={Upcoming} title="Upcoming" />
        </>
      )}
    </Wrapper>
  );
}
