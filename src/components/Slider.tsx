import styled from "styled-components";
import LeftIcon from "../assets/icon-left.svg";
import RightIcon from "../assets/icon-right.svg";
import MovieModalComponent from "./MovieModal";
import { AnimatePresence, motion } from "framer-motion";
import { MouseEvent, useState } from "react";
import { IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  position: relative;
  top: -100px;

  .arrow {
    position: absolute;
    top: 80px;
    left: 10px;
    cursor: pointer;
    transition: all 0.2s linear;

    &:hover {
      transform: scale(1.4);
    }
  }

  .arrow:last-child {
    right: 10px;
    left: auto;
  }
`;

const Row = styled(motion.div)`
  width: 100%;
  margin-bottom: 5px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  height: 200px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  font-size: 66px;
  cursor: pointer;
  border-radius: 15px;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  bottom: 0;
  opacity: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  visible: { x: 0 },
  exit: (isBack: boolean) => ({
    x: isBack ? window.innerWidth + 10 : -window.innerWidth + 10,
  }),
};

const boxVariants = {
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

// 스타일드 컴포넌트 영역 끝

interface ISliderProps {
  data: IGetMovieResult | undefined;
}

export default function Slider({ data }: ISliderProps) {
  const OFFSET = 6;
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);

  const handleIndex = async (event: MouseEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1;
      // console.log(maxIndex);
      if (target.alt === "go-right-icon") {
        await setIsBack(false);
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        await setIsBack(true);
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onOverlayClick = () => navigate("/");

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  if (!data) return null;

  return (
    <Wrapper>
      <AnimatePresence
        // initial={false}
        onExitComplete={toggleLeaving}
      >
        <Row
          key={index}
          style={{
            x: isBack ? -window.innerWidth - 10 : window.innerWidth - 10,
          }}
          custom={isBack}
          transition={{ type: "tween", duration: 1 }}
          variants={rowVariants}
          animate="visible"
          exit="exit"
        >
          {data?.results
            .slice(1)
            .slice(OFFSET * index, OFFSET * index + OFFSET)
            .map((movie) => (
              <Box
                key={movie.id}
                variants={boxVariants}
                whileHover="hover"
                transition={{ type: "tween" }}
                $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                onClick={() => onBoxClicked(movie.id)}
                layoutId={String(movie.id)}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <img
        src={LeftIcon}
        alt="go-left-icon"
        className="arrow"
        onClick={handleIndex}
      />
      <img
        src={RightIcon}
        alt="go-right-icon"
        className="arrow"
        onClick={handleIndex}
      />
      <MovieModalComponent
        bigMovieMatch={bigMovieMatch}
        onOverlayClick={onOverlayClick}
        clickedMovie={clickedMovie}
      />
    </Wrapper>
  );
}
