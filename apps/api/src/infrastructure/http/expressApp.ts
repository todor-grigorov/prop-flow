import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "../logging/logger.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { meRouter } from "./routes/me.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export function createExpressApp() {
  const app = express();

  app.use(express.json());

  app.use(
    pinoHttp({
      logger,
    }),
  );

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/me", meRouter);

  app.use(errorMiddleware);

  return app;
}
