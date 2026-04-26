import { NextFunction, Request, Response } from "express";
import { Permission } from "../../../domain/enums/permission.js";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../../domain/errors/applicationError.js";
import { can } from "../../../application/services/permissionService.js";

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.context) {
        throw new UnauthorizedError();
      }

      if (!can(req.context.role, permission)) {
        throw new ForbiddenError(`Missing permission: ${permission}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
