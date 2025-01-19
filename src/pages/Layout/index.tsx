import { Outlet } from "react-router";
import styled from "styled-components";
import { Toaster } from "../../widgets/Toaster";

const Wrapper = styled.div`
  width: 100%;
  min-height: 100%;
  padding-left: 20px;
  padding-right: 20px;
  overflow: auto;
`;

export const Layout = () => (
  <>
    <Wrapper>
      <Toaster />
      <Outlet />
    </Wrapper>
  </>
);
