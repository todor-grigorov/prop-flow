import { Role } from "../../domain/enums/role.js";

export type AccessTokenPayload = {
  sub: string;
  tenantId: string;
  role: Role;
};

export interface TokenService {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
}
