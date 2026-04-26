import { User } from "../../domain/entities/user.js";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
}
