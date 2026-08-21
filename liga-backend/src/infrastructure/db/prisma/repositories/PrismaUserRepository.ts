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

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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

  async update(user: User): Promise<User> {
    return await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        role: user.role as any,
        ...(user.password ? { password: user.password } : {}),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
