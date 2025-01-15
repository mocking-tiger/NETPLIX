import styled from "styled-components";
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
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  padding: 10px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;

// 스타일드 컴포넌트 영역 끝

interface IModalProps {
  bigMovieMatch: PathMatch<"movieId"> | null;
  onOverlayClick: () => void;
  clickedMovie: "" | IMovie | undefined;
}

export default function MovieModalComponent({
  bigMovieMatch,
  onOverlayClick,
  clickedMovie,
}: IModalProps) {
  const { scrollY } = useScroll();
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
            style={{ top: scrollY.get() + 100 }}
            layoutId={bigMovieMatch.params.movieId}
          >
            {clickedMovie && (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black,transparent),url(${makeImagePath(
                      clickedMovie.backdrop_path,
                      "w500"
                    )})`,
                  }}
                />
                <BigTitle>{clickedMovie.title}</BigTitle>
                <BigOverview>{clickedMovie.overview}</BigOverview>
              </>
            )}
          </MovieModal>
        </>
      )}
    </AnimatePresence>
  );
}
