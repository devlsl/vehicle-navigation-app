import { ReactNode, useRef } from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { createSocketInstance } from "./createSocketInstance";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket>(createSocketInstance());

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
