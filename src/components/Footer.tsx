import styled from "styled-components";

const Footer = styled.footer`
  height: 100px;
  padding: 40px 20px;
  border-top: 1px solid darkgray;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  user-select: none;
  position: relative;
  /* transform: translateY(-100%); */

  h6 {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function FooterComponent() {
  return (
    <Footer>
      <h5>푸터입니다</h5>
      <h5>Copyright c 2025 NETPLIX. All rights reserved.</h5>
      <h6>이메일주소</h6>
      <h6>무단수집</h6>
      <h6>거부내용</h6>
      <h6>저작권 정보</h6>
      <h6>개인정보처리 방침</h6>
      <h6>이용약관</h6>
    </Footer>
  );
}
