import { Socket } from "socket.io-client";
import { z } from "zod";

class EmitError extends Error {}

const emitWithAckWIthPayload = async <P, R extends z.ZodTypeAny>(
  socket: Socket,
  event: string,
  responseSchema: R,
  payload: P
) => {
  try {
    const response = await socket.emitWithAck(event, payload);
    console.log(response);
    const parsingResult = responseSchema.safeParse(response);
    if (parsingResult.success) {
      return parsingResult.data as z.infer<R>;
    } else {
      throw new EmitError("schema error");
    }
  } catch {
    throw new EmitError("network error");
  }
};

const emitWithAck = async <R extends z.ZodTypeAny>(
  socket: Socket,
  event: string,
  responseSchema: R
) => {
  try {
    const response = await socket.emitWithAck(event);
    const parsingResult = responseSchema.safeParse(response);
    if (parsingResult.success) {
      return parsingResult.data as z.infer<R>;
    } else {
      throw new EmitError("schema error");
    }
  } catch {
    throw new EmitError("network error");
  }
};

const emit = async (socket: Socket, event: string) => {
  try {
    await socket.emitWithAck(event);
  } catch {
    throw new EmitError("network error");
  }
};

const emitWithPayload = async <P>(
  socket: Socket,
  event: string,
  payload: P
) => {
  try {
    await socket.emitWithAck(event, payload);
  } catch {
    throw new EmitError("network error");
  }
};

export const SocketEmmiter = (event: string) => ({
  bindResponseSchema: <R extends z.ZodTypeAny>(responseSchema: R) => ({
    createWithPayload:
      <P>() =>
      (socket: Socket, payload: P) =>
        emitWithAckWIthPayload(socket, event, responseSchema, payload),
    create: () => (socket: Socket) =>
      emitWithAck(socket, event, responseSchema),
  }),
  createWithPayload:
    <P>() =>
    (socket: Socket, payload: P) =>
      emitWithPayload(socket, event, payload),
  create: () => (socket: Socket) => emit(socket, event),
});
