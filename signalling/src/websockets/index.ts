import { Server as IOServer } from "socket.io";
import {
  ClientEvents,
  ServerEvents,
  WebRtcAnswer,
  WebRtcOffer,
} from "../../../lib/src/types/websockets";
import { Logger } from "../lib/logger";
import { Server, Socket } from "./types";

const onJoinRoom = (logger: Logger, socket: Socket) => (room: string) => {
  logger.info(`join room=${room} sid=${socket.id}`);

  socket.join(room);
  socket.broadcast.to(room).emit("peerConnect", socket.id);
};

const onWebRtcAnswer =
  (logger: Logger, server: Server, socket: Socket) =>
  ({ answerSdp, toSid }: WebRtcAnswer) => {
    logger.info(`webRtcAnswer fromSid=${socket.id} toSid=${toSid} room`);

    server.sockets.sockets
      .get(toSid)
      ?.emit("webRtcAnswer", { answerSdp, fromSid: socket.id });
  };

const onWebRtcOffer =
  (logger: Logger, server: Server, socket: Socket) =>
  ({ offerSdp, toSid }: WebRtcOffer) => {
    logger.info(`webRtcOffer fromSid=${socket.id} toSid=${toSid} room`);

    server.sockets.sockets
      .get(toSid)
      ?.emit("webRtcOffer", { fromSid: socket.id, offerSdp });
  };

const onDisconnect = (logger: Logger, socket: Socket) => (reason: string) => {
  logger.info(`disconnecting reason=${reason} sid=${socket.id}`);

  socket.rooms.forEach((room) => {
    socket.broadcast.to(room).emit("peerDisconnect", socket.id);
  });
};

const onConnection = (logger: Logger, server: Server) => (socket: Socket) => {
  logger.info(`connection sid=${socket.id}`);

  socket.emit("connected");
  socket.on("joinRoom", onJoinRoom(logger, socket));
  socket.on("disconnecting", onDisconnect(logger, socket));
  socket.on("webRtcAnswer", onWebRtcAnswer(logger, server, socket));
  socket.on("webRtcOffer", onWebRtcOffer(logger, server, socket));
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

  server.on("connection", onConnection(logger, server));

  return server;
};
