import { Server } from "socket.io";
import { Logger } from "winston";

const PORT = 8080;

export const createServer = (logger: Logger): void => {
  const io = new Server({
    cors: {
      origin:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://example.com",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`connection id=${socket.id}`);
  });

  io.listen(PORT);

  logger.info(`Started listening on ${PORT}`);
};
