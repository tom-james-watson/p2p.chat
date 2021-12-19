import { Server as IOServer } from "socket.io";
import {
  ClientEvents,
  ServerEvents,
  WebRtcAnswer,
  WebRtcIceCandidate,
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
  ({ answerSdp, sid }: WebRtcAnswer) => {
    logger.info(`webRtcAnswer fromSid=${socket.id} toSid=${sid}`);

    server.sockets.sockets
      .get(sid)
      ?.emit("webRtcAnswer", { answerSdp, sid: socket.id });
  };

const onWebRtcIceCandidate =
  (logger: Logger, server: Server, socket: Socket) =>
  ({ candidate, label, sid }: WebRtcIceCandidate) => {
    logger.debug(`webRtcIceCandidate fromSid=${socket.id} toSid=${sid}`);

    server.sockets.sockets
      .get(sid)
      ?.emit("webRtcIceCandidate", { candidate, label, sid: socket.id });
  };

const onWebRtcOffer =
  (logger: Logger, server: Server, socket: Socket) =>
  ({ offerSdp, sid }: WebRtcOffer) => {
    logger.info(`webRtcOffer fromSid=${socket.id} toSid=${sid}`);

    server.sockets.sockets
      .get(sid)
      ?.emit("webRtcOffer", { sid: socket.id, offerSdp });
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
  socket.on("webRtcIceCandidate", onWebRtcIceCandidate(logger, server, socket));
  socket.on("webRtcOffer", onWebRtcOffer(logger, server, socket));
};

export const createServer = (logger: Logger): Server => {
  const server = new IOServer<ClientEvents, ServerEvents>({
    cors: {
      origin: process.env.NODE_ENV === "development" ? "*" : "https://p2p.chat",
      methods: ["GET", "POST"],
    },
  });

  server.on("connection", onConnection(logger, server));

  return server;
};
