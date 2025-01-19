import { createBrowserRouter } from "react-router";
import { ObjectListPage } from "../../pages/ObjectListPage/index.tsx";
import { ObjectItemPage } from "../../pages/ObjectItemPage/index.tsx";
import { NotFoundPage } from "../../pages/NotFoundPage.tsx/index.tsx";
import { Layout } from "../../pages/Layout/index.tsx";
import { MainPage } from "../../pages/Main/index.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "objects",
        element: <ObjectListPage />,
      },
      {
        path: "object/:id",
        element: <ObjectItemPage />,
      },
      {
        path: "*",
        element: <NotFoundPage entityName="Page" />,
      },
    ],
  },
]);
