import prisma from "../PrismaClient";
import { Tournament } from "../../../../domain/entities/Tournament";
import { TournamentRepository } from "../../../../domain/repositories/TournamentRepository";

export class PrismaTournamentRepository implements TournamentRepository {
  private prisma = prisma;
  constructor() {}

  async findAll(): Promise<Tournament[]> {
    const prismaTournaments = await this.prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
    });
    return prismaTournaments.map(
      (t) =>
        new Tournament(
          t.id,
          t.name,
          t.headquartersId ?? undefined,
          t.maxYellowCardsForSuspension,
          t.active,
          t.createdAt,
          t.updatedAt,
        ),
    );
  }

  async findById(id: string): Promise<Tournament | null> {
    const t = await this.prisma.tournament.findUnique({ where: { id } });
    if (!t) return null;
    return new Tournament(
      t.id,
      t.name,
      t.headquartersId ?? undefined,
      t.maxYellowCardsForSuspension,
      t.active,
      t.createdAt,
      t.updatedAt,
    );
  }

  async save(tournament: Tournament): Promise<Tournament> {
    const t = await this.prisma.tournament.upsert({
      where: { id: tournament.id },
      update: {
        name: tournament.name,
        headquartersId: tournament.headquartersId,
        maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
        active: tournament.active,
      },
      create: {
        id: tournament.id,
        name: tournament.name,
        headquartersId: tournament.headquartersId,
        maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
        active: tournament.active,
      },
    });
    return new Tournament(
      t.id,
      t.name,
      t.headquartersId ?? undefined,
      t.maxYellowCardsForSuspension,
      t.active,
      t.createdAt,
      t.updatedAt,
    );
  }

  async update(tournament: Tournament): Promise<Tournament> {
    const t = await this.prisma.tournament.update({
      where: { id: tournament.id },
      data: {
        name: tournament.name,
        headquartersId: tournament.headquartersId,
        maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
        active: tournament.active,
      },
    });
    return new Tournament(
      t.id,
      t.name,
      t.headquartersId ?? undefined,
      t.maxYellowCardsForSuspension,
      t.active,
      t.createdAt,
      t.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tournament.delete({ where: { id } });
  }

  async findActive(): Promise<Tournament | null> {
    const t = await this.prisma.tournament.findFirst({
      where: { active: true },
    });
    if (!t) return null;
    return new Tournament(
      t.id,
      t.name,
      t.headquartersId ?? undefined,
      t.maxYellowCardsForSuspension,
      t.active,
      t.createdAt,
      t.updatedAt,
    );
  }
}
