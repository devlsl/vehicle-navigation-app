import { io } from "socket.io-client";

export const createSocketInstance = () => io("ws://localhost:3006");
