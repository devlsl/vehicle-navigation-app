import { createBrowserRouter, Link, Outlet, useParams } from "react-router";
import styled from "styled-components";
import { ObjectList } from "../object-list";
import { ObjectItemPage } from "../object-item-page";

const Wrapper = styled.div`
  width: 100%;
  height: 100dvh;
  border: 1px solid black;
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

const Layout = () => (
  <Wrapper>
    <Outlet />
  </Wrapper>
);

const Index = () => {
  return <Link to="/objects">objects</Link>;
};

const ObjectsPage = () => {
  return (
    <>
      <ObjectList />
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "objects",
        element: <ObjectsPage />,
      },
      {
        path: "object/:id",
        element: <ObjectItemPage />,
      },
    ],
  },
]);
