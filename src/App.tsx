import Home from "./routes/Home";
import Tv from "./routes/Tv";
import Search from "./routes/Search";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 할 일
// 0. 컴포넌트 분리하기 V
// 1. 주제별 슬라이더V
// 1-2. 모달 겹치는 현상 수정 V
// 2. TV쇼 화면 V
// 3. 상세페이지 디자인 개선
// 3-2. 배너 디자인 개선
// 4. 검색 기능(어떤식으로 구현할지?)
// 5. 반응형 디자인(다음 프로젝트 생각 안나면)

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="movies/:title/:id" element={<Home />} />
        <Route path="/tv*" element={<Tv />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
