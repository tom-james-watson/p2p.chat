import winston from "winston";
import { format, Logger } from "winston";

export const createConsoleLogger = (): Logger => {
  const consoleTransport = new winston.transports.Console();

  return winston.createLogger({
    transports: [consoleTransport],
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: "HH:mm:ss:ms" }),
      format.printf(
        (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
      )
    ),
  });
};

export { Logger };
