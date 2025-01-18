import { SocketProvider } from "./socketContext/SocketProvider";
import { Router } from "./router/Router";

export const App = () => {
  return (
    <SocketProvider>
      <Router />
    </SocketProvider>
  );
};
