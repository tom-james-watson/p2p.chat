import { createConsoleLogger } from "./logger";
import { createServer } from "./server";

const logger = createConsoleLogger();
createServer(logger);
