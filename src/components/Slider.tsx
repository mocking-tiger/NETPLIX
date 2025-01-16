import styled from "styled-components";
import LeftIcon from "../assets/icon-left.svg";
import RightIcon from "../assets/icon-right.svg";
import MovieModalComponent from "./MovieModal";
import { AnimatePresence, motion } from "framer-motion";
import { MouseEvent, useState } from "react";
import { IGetMovieResult, IMovie } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  margin-bottom: 230px;
  position: relative;
  top: -100px;

  .arrow {
    position: absolute;
    top: 105px;
    left: 10px;
    cursor: pointer;
    transition: all 0.2s linear;

    &:hover {
      transform: scale(1.4);
    }
  }

  .arrow:nth-of-type(2) {
    right: 10px;
    left: auto;
  }

  h2 {
    font-size: 24px;
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
  bottom: -20px;
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
  title: string;
  where?: string;
}

export default function Slider({
  data,
  title,
  where = "movies",
}: ISliderProps) {
  const OFFSET = 6;
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/${where}/${title}/:movieId`);
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

  const onOverlayClick = () => navigate(where === "tv" ? `/${where}` : "/");

  const onBoxClicked = (movieId: number) => {
    navigate(`/${where}/${title}/${movieId}`);
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie: IMovie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  if (!data) return null;

  return (
    <Wrapper>
      <AnimatePresence
        // initial={false}
        onExitComplete={toggleLeaving}
      >
        <h2>{title}</h2>
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
                layoutId={`${title}-${movie.id}`}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.name ? movie.name : movie.title}</h4>
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
        title={title}
      />
    </Wrapper>
  );
}

// adult: false;
// backdrop_path: "/96RT2A47UdzWlUfvIERFyBsLhL2.jpg";
// id: 209867;
// name: "장송의 프리렌";
// original_name: "葬送のフリーレン";
// overview: "용사 힘멜 일행과 함께 10년에 걸친 모험 끝에 마왕을 물리치고 세계에 평화를 가져온 마법사 프리렌. 천 년을 넘게 사는 엘프인 그녀는 힘멜 일행과 재회를 약속하고 혼자 여행을 떠난다. 그로부터 50년 후 프리렌은 힘멜을 찾아갔지만 50년 전과 달라진 게 없는 그녀에 비해 힘멜은 늙었고 수명이 얼마 남아있지 않았다. 그 후 죽음을 맞이한 힘멜을 보고 지금까지 '인간을 아는' 일을 하지 않았던 것을 후회하고 자신을 반성한 프리렌은 '인간을 알기 위한' 여행을 떠난다. 그 여로에는 다양한 사람들과의 만남, 다양한 사건들이 기다리고 있었는데──.";
// poster_path: "/mnj30hYDVAbL9BOA0f4HrKubAGF.jpg";
// vote_average: 8.8;

// adult: false;
// backdrop_path: "/ie8OSgIHEl6yQiGJ90dsyBWOpQA.jpg";
// id: 839033;
// original_title: "The Lord of the Rings: The War of the Rohirrim";
// overview: "로한의 전설적인 왕 무쇠주먹 ‘헬름’은 공주 ‘헤라’와 자신의 아들 ‘울프’와의 결혼을 요구하는 웨스트마크 영주인 ‘프레카’와 결투를 벌이다 예기치 않게 그를 죽이고 만다. 아버지의 죽음에 격분하여 복수를 다짐하고 사라진 ‘울프’. 어느 날, 그는 무자비한 던랜드인을 이끌고 나타나 로한을 공격한다. ‘헬름’과 그의 아들 ‘할레스’와 ‘하마’, 그리고 기마대 로히림이 공격에 맞서지만 영주들의 배신으로 크게 패배하며 나팔 산성으로 퇴각하게 된다. ‘할레스’와 ‘하마’ 두 왕자를 모두 잃은 ‘헬름’과 ‘헤라’는 ‘울프’와 대규모 던랜드 군대에 의해 나팔 산성에 고립된 상황에서 모두의 목숨을 건 마지막 전투를 준비한다.";
// poster_path: "/eeN1fRy5UjTwtTQTz1EdVaE5aC.jpg";
// title: "반지의 제왕: 로히림의 전쟁";
// vote_average: 6.523;
