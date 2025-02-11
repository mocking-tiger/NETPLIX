import styled from "styled-components";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  width: 100%;
  padding: 20px 60px;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 9999;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  width: 95px;
  height: 25px;
  margin-right: 50px;

  path {
    stroke-width: 6px;
    stroke: white;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;

  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;

  svg {
    height: 25px;
  }

  span {
    width: 300px;
    position: absolute;
    left: -190px;
    bottom: -30px;
    color: pink;
  }
`;

const Circle = styled(motion.span)`
  width: 5px;
  height: 5px;
  background-color: ${(props) => props.theme.red};
  border-radius: 5px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: -5px;
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    // fillOpacity: [0, 1, 0],
    // transition: {
    //   repeat: 5,
    // },
    scale: 1.4,
  },
};

// 스타일드 컴포넌트 영역 끝

interface IForm {
  keyword: string;
}

export default function Header() {
  const homeMatch = useMatch("/");
  const bigMovieMatch = useMatch("/movies/:title/:movieId");
  const tvMatch = useMatch("/tv");
  const bigTvMatch = useMatch("/tv/:titld/:showId");
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
  } = useForm<IForm>();
  const [isSerachOpen, setIsSearchOpen] = useState(false);
  const [isScrollDown, setIsScrollDown] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setTimeout(() => {
      setFocus("keyword");
    }, 0);
  };

  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
    setValue("keyword", "");
  };

  useMotionValueEvent(scrollY, "change", (value) => {
    // console.log(value);
    if (value > 100) {
      setIsScrollDown(true);
    } else {
      setIsScrollDown(false);
    }
  });

  return (
    <Nav
      animate={{
        backgroundColor: isScrollDown ? "rgba(0,0,0,0)" : "rgba(0,0,0,1)",
      }}
      transition={{ duration: 1 }}
    >
      <Col>
        <Link to={"/"}>
          <Logo
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 276.742"
            variants={logoVariants}
            animate="normal"
            whileHover="active"
          >
            <motion.path
              d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
              fill="#d81f26"
            />
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to={"/"}>
              Home{" "}
              {(homeMatch || bigMovieMatch) && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to={"/tv"}>
              Tv Shows {(tvMatch || bigTvMatch) && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            style={{ cursor: "pointer" }}
            onClick={toggleSearch}
            animate={{ x: isSerachOpen ? -215 : 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", {
              required: true,
              minLength: { value: 2, message: "두 글자 이상 입력해야 합니다." },
            })}
            transition={{ type: "linear" }}
            animate={{ scaleX: isSerachOpen ? 1 : 0 }}
            placeholder="Search for movie or tv show"
          ></Input>
          {errors.keyword && <span>{errors.keyword.message}</span>}
        </Search>
      </Col>
    </Nav>
  );
}
