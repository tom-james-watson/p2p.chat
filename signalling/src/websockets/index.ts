import { Server as IOServer } from "socket.io";
import { ClientEvents, ServerEvents } from "../../../lib/src/types/websockets";
import { Logger } from "../lib/logger";
import { Server, Socket } from "./types";

const onJoinRoom = (logger: Logger, socket: Socket) => (room: string) => {
  logger.info(`join room=${room} sid=${socket.id}`);

  socket.join(room);
  socket.broadcast.to(room).emit("peerConnect", socket.id);
};

const onDisconnect = (logger: Logger, socket: Socket) => (reason: string) => {
  logger.info(`disconnecting reason=${reason} sid=${socket.id}`);

  socket.rooms.forEach((room) => {
    socket.broadcast.to(room).emit("peerDisconnect", socket.id);
  });
};

const onConnection = (logger: Logger) => (socket: Socket) => {
  logger.info(`connection sid=${socket.id}`);

  socket.emit("connected");
  socket.on("joinRoom", onJoinRoom(logger, socket));
  socket.on("disconnecting", onDisconnect(logger, socket));
};

export const createServer = (logger: Logger): Server => {
  const server = new IOServer<ClientEvents, ServerEvents>({
    cors: {
      origin:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://example.com",
      methods: ["GET", "POST"],
    },
  });

  server.on("connection", onConnection(logger));

  return server;
};
