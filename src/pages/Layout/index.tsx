import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import styled from "styled-components";
import { Toaster } from "../../widgets/Toaster";

const Wrapper = styled.div`
  width: 100%;
  height: 100dvh;
  padding-left: 20px;
  padding-right: 20px;
`;

export const Layout = () => (
  <>
    <Toaster />
    <Wrapper>
      <Outlet />
    </Wrapper>
  </>
);
