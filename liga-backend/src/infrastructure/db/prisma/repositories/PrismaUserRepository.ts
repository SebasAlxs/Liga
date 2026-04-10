import prisma from "../PrismaClient";
import { User, UserRole } from "../../../../domain/entities/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";

export class PrismaUserRepository implements UserRepository {
  private prisma = prisma;

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(user: User): Promise<User> {
    return await prisma.user.create({
      data: {
        email: user.email,
        password: user.password!,
        role: user.role as any,
      },
    });
  }
}
