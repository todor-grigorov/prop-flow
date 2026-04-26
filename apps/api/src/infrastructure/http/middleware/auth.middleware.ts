import { NextFunction, Request, Response } from "express";
import { container } from "../../container.js";
import { UnauthorizedError } from "../../../domain/errors/applicationError.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = req.header("authorization");

    if (!authorizationHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing bearer token");
    }

    const token = authorizationHeader.slice("Bearer ".length);
    const payload = await container.tokenService.verifyAccessToken(token);

    req.context = {
      userId: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
