import { createConsoleLogger } from "./lib/logger";
import { createServer } from "./websockets";

const PORT = 8080;

const logger = createConsoleLogger();
const server = createServer(logger);

server.listen(PORT);
logger.info(`Started listening on ${PORT}`);
