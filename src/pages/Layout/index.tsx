import { Outlet } from "react-router";
import styled from "styled-components";
import { Toaster } from "../../widgets/Toaster";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 100px;
`;

export const Layout = () => (
  <>
    <Toaster />
    <Wrapper>
      <Outlet />
    </Wrapper>
  </>
);
