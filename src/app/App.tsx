import { SocketProvider } from "../shared/modules/socket/context/SocketProvider.tsx";
import { Router } from "./router/Router.tsx";
import { Suspense } from "react";
import { LoadingPage } from "../pages/LoadingPage.tsx";
import "./styles/index.css";

export const App = () => (
  <Suspense fallback={<LoadingPage />}>
    <SocketProvider>
      <Router />
    </SocketProvider>
  </Suspense>
);
