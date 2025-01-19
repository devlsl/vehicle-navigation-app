import { io } from "socket.io-client";

export const createSocketInstance = () => io(import.meta.env.VITE_BACKEND_URL);
