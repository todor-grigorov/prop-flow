import { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../../../domain/errors/applicationError.js";
import { logger } from "../../logging/logger.js";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ApplicationError) {
    return res.status(error.statusCode).json({
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }

  logger.error({ error }, "Unhandled error");

  return res.status(500).json({
    error: {
      name: "InternalServerError",
      message: "Internal server error",
    },
  });
}
