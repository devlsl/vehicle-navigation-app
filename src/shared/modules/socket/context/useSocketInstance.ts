import { useContext } from "react";
import { SocketContext } from "./SocketContext";

export const useSocketInstance = () => {
  const socket = useContext(SocketContext);
  if (socket === null) {
    throw new Error("useSocketInstance must be used within an SocketProvider");
  }

  return socket;
};
