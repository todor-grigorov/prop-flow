import jwt, { SignOptions } from "jsonwebtoken";
import {
  AccessTokenPayload,
  TokenService,
} from "../../application/ports/tokenService.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../../domain/errors/applicationError.js";

export class JwtTokenService implements TokenService {
  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, options);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);

      if (
        typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.sub !== "string" ||
        typeof decoded.tenantId !== "string" ||
        typeof decoded.role !== "string"
      ) {
        throw new UnauthorizedError("Invalid access token");
      }

      return {
        sub: decoded.sub,
        tenantId: decoded.tenantId,
        role: decoded.role as AccessTokenPayload["role"],
      };
    } catch {
      throw new UnauthorizedError("Invalid or expired access token");
    }
  }
}
