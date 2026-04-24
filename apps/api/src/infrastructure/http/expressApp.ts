import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "../logging/logger.js";
import { healthRouter } from "./routes/health.routes.js";

export function createExpressApp() {
  const app = express();

  app.use(express.json());

  app.use(
    pinoHttp({
      logger,
    }),
  );

  app.use("/health", healthRouter);

  return app;
}
