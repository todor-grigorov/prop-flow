import { RequestContext } from "../../../application/dto/requestContext.js";

declare global {
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

export {};
