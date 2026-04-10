import { Referee } from "../../../../domain/entities/Referee";
import prisma from "../PrismaClient";

export class PrismaRefereeRepository {
  private prisma = prisma;

  async create(referee: Referee): Promise<Referee> {
    return await this.prisma.referee.create({
      data: {
        name: referee.name,
        license: referee.license,
        phone: referee.phone,
        email: referee.email,
        photo: referee.photo,
        active: referee.active !== undefined ? referee.active : true,
      },
    }) as Referee;
  }

  async findAll(): Promise<Referee[]> {
    return await this.prisma.referee.findMany({
      orderBy: { name: 'asc' }
    }) as Referee[];
  }

  async findById(id: string): Promise<Referee | null> {
    return await this.prisma.referee.findUnique({
      where: { id },
    }) as Referee | null;
  }

  async update(id: string, referee: Partial<Referee>): Promise<Referee> {
    return await this.prisma.referee.update({
      where: { id },
      data: {
        name: referee.name,
        license: referee.license,
        phone: referee.phone,
        email: referee.email,
        photo: referee.photo,
        active: referee.active,
      },
    }) as Referee;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.referee.delete({
      where: { id },
    });
  }
}
