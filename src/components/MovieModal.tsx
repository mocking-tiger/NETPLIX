import styled from "styled-components";
import DefaultImage from "../assets/netflix-logo.png";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { PathMatch } from "react-router-dom";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  position: fixed;
  top: 0;
  z-index: 1;
`;

const MovieModal = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
`;

const BigCover = styled.div`
  width: 100%;
  height: 500px;
  background-size: cover;
  background-position: center center;
  position: relative;
  top: -20px;

  div {
    position: absolute;
    top: 30px;
    left: 20px;
    width: 250px;
    height: 350px;
    background-color: black;
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
  }
`;

const BigTitle = styled.h3`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  display: flex;
  flex-direction: column;
  position: relative;
  top: -150px;

  div {
    display: flex;
    align-items: center;

    span:nth-of-type(1) {
      max-width: 550px;
      margin-bottom: 5px;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    span:nth-of-type(2) {
      margin-left: 10px;
      font-size: 18px;
    }
  }

  span:nth-of-type(1) {
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const BigOverview = styled.p`
  height: 230px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  overflow-y: auto;
  position: relative;
  top: -150px;
  line-height: 25px;
`;

// 스타일드 컴포넌트 영역 끝

interface IModalProps {
  bigMovieMatch: PathMatch<"movieId"> | string | null;
  onOverlayClick: () => void;
  clickedMovie: "" | IMovie | undefined;
  title: string;
}

export default function MovieModalComponent({
  bigMovieMatch,
  onOverlayClick,
  clickedMovie,
  title,
}: IModalProps) {
  const { scrollYProgress } = useScroll();
  // console.log(clickedMovie);
  return (
    <AnimatePresence>
      {bigMovieMatch && (
        <>
          <Overlay
            onClick={onOverlayClick}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <MovieModal
            style={{ top: scrollYProgress.get() + 100 }}
            layoutId={`${title}-${
              typeof bigMovieMatch !== "string"
                ? bigMovieMatch.params.movieId
                : bigMovieMatch
            }`}
          >
            {clickedMovie && (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black,rgba(0,0,0,0.7)),url(${makeImagePath(
                      clickedMovie.backdrop_path,
                      "w500"
                    )})`,
                  }}
                >
                  <div
                    style={{
                      backgroundImage: clickedMovie.poster_path
                        ? `url(${makeImagePath(clickedMovie.poster_path)})`
                        : `url(${DefaultImage})`,
                    }}
                  />
                </BigCover>
                <BigTitle>
                  <div>
                    <span
                      title={clickedMovie.title ?? clickedMovie.name}
                      style={{
                        fontSize:
                          (clickedMovie.title ?? clickedMovie.name).length > 20
                            ? "18px"
                            : "inherit",
                        paddingTop:
                          (clickedMovie.title ?? clickedMovie.name).length > 20
                            ? "40px"
                            : "10px",
                      }}
                    >
                      {clickedMovie.title ?? clickedMovie.name}
                    </span>
                    <span
                      style={{
                        paddingTop:
                          (clickedMovie.title ?? clickedMovie.name).length > 20
                            ? "40px"
                            : "30px",
                      }}
                    >
                      ⭐
                      {clickedMovie.vote_average !== 0
                        ? clickedMovie.vote_average.toFixed(1)
                        : "리뷰정보 없음"}
                    </span>
                  </div>
                  <span
                    title={
                      clickedMovie.original_title ?? clickedMovie.original_name
                    }
                  >
                    {`(${
                      clickedMovie.original_title ?? clickedMovie.original_name
                    })`}
                  </span>
                </BigTitle>
                <BigOverview>
                  {clickedMovie.overview === ""
                    ? "**한국어로 개요가 제공되지 않는 작품입니다.**"
                    : clickedMovie.overview}
                </BigOverview>
              </>
            )}
          </MovieModal>
        </>
      )}
    </AnimatePresence>
  );
}
