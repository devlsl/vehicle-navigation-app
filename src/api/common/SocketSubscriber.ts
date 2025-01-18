import { Socket } from "socket.io-client";
import { z } from "zod";

const sub = (socket: Socket, event: string, cb: (data: unknown) => void) => {
  socket.on(event, cb);
  return () => {
    socket.off(event, cb);
  };
};

export const SocketSubscriber = (event: string) => ({
  bindResponseSchema: <R extends z.ZodTypeAny>(responseSchema: R) => ({
    create: () => (socket: Socket, listener: (data: z.infer<R>) => void) => {
      const cb = (data: unknown) => {
        try {
          const parsingResult = responseSchema.safeParse(data);
          parsingResult.success && listener(parsingResult.data as z.infer<R>);
        } catch {}
      };
      return sub(socket, event, cb);
    },
  }),
  create: () => (socket: Socket, listener: () => void) => {
    const cb = () => listener();
    return sub(socket, event, cb);
  },
});
