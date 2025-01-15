import { useQuery } from "react-query";
import { Banner, Loader, Overview, Title, Wrapper } from "./Home";
import {
  getTvAiringToday,
  getTvPopular,
  getTvTopRated,
  IGetMovieResult,
} from "../api";
import { makeImagePath } from "../utils";
import Slider from "../components/Slider";

export default function Tv() {
  const { data: topRated, isLoading } = useQuery<IGetMovieResult>(
    ["tv-show", "airingToday"],
    getTvTopRated
  );

  const { data: popular } = useQuery<IGetMovieResult>(
    ["tv-show", "popular"],
    getTvPopular
  );

  const { data: onTheAir } = useQuery<IGetMovieResult>(
    ["tv-show", "onTheAir"],
    getTvAiringToday
  );

  const { data: airingToday } = useQuery<IGetMovieResult>(
    ["tv-show", "airingToday"],
    getTvAiringToday
  );

  console.log(topRated);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(topRated?.results[0].backdrop_path || "")}
          >
            <Title>{topRated?.results[0].name}</Title>
            <Overview>{topRated?.results[0].overview}</Overview>
          </Banner>
          <Slider data={topRated} title="Top Rated" where="tv" />
          <Slider data={popular} title="Popular" where="tv" />
          <Slider data={onTheAir} title="On The Air" where="tv" />
          <Slider data={airingToday} title="Airing Today" where="tv" />
        </>
      )}
    </Wrapper>
  );
}
