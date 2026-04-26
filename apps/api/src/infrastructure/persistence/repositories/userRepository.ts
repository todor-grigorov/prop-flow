import { IUserRepository } from "../../../application/ports/IUserRepository.js";
import { User } from "../../../domain/entities/user.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
