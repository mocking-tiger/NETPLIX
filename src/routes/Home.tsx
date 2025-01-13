import { useQuery } from "react-query";
import { getMovies, IGetMovieResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 68px;
`;

const Overview = styled.p`
  width: 50%;
  font-size: 36px;
`;

// 스타일드 컴포넌트 영역 끝

export default function Home() {
  const { data, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data?.results[0].backdrop_path);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}
