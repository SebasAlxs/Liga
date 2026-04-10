import prisma from "../PrismaClient";
import { Team } from "../../../../domain/entities/Team";
import { TeamRepository } from "../../../../domain/repositories/TeamRepository";

export class PrismaTeamRepository implements TeamRepository {
    private prisma = prisma;

    async create(team: Team): Promise<Team> {
        const created = await this.prisma.team.create({
            data: {
                id: team.id,
                name: team.name,
                logo: team.logo,
                foundedYear: team.foundedYear,
                championshipsWon: team.championshipsWon,
                categoryId: team.categoryId,
                tournamentId: team.tournamentId,
            },
        });

        return new Team(
            created.id,
            created.name,
            created.logo,
            created.foundedYear,
            created.championshipsWon ?? undefined,
            created.categoryId ?? undefined,
            created.tournamentId ?? undefined,
            created.points,
            created.matchesPlayed,
            created.matchesWon,
            created.matchesDrawn,
            created.matchesLost,
            created.goalsFor,
            created.goalsAgainst,
            created.goalDifference
        );
    }

    async findById(id: string): Promise<Team | null> {
        const team = await this.prisma.team.findUnique({ where: { id } });
        if (!team) return null;
        return new Team(
            team.id,
            team.name,
            team.logo,
            team.foundedYear,
            team.championshipsWon ?? undefined,
            team.categoryId ?? undefined,
            team.tournamentId ?? undefined,
            team.points,
            team.matchesPlayed,
            team.matchesWon,
            team.matchesDrawn,
            team.matchesLost,
            team.goalsFor,
            team.goalsAgainst,
            team.goalDifference
        );
    }

    async findByName(name: string): Promise<Team | null> {
        const team = await this.prisma.team.findFirst({ where: { name } });
        if (!team) return null;
        return new Team(
            team.id,
            team.name,
            team.logo,
            team.foundedYear,
            team.championshipsWon ?? undefined,
            team.categoryId ?? undefined,
            team.tournamentId ?? undefined,
            team.points,
            team.matchesPlayed,
            team.matchesWon,
            team.matchesDrawn,
            team.matchesLost,
            team.goalsFor,
            team.goalsAgainst,
            team.goalDifference
        );
    }

    async findAll(): Promise<Team[]> {
        const teams = await this.prisma.team.findMany();
        return teams.map(
            (t) => new Team(
                t.id, t.name, t.logo, t.foundedYear, t.championshipsWon ?? undefined, t.categoryId ?? undefined, t.tournamentId ?? undefined,
                t.points, t.matchesPlayed, t.matchesWon, t.matchesDrawn, t.matchesLost, t.goalsFor, t.goalsAgainst, t.goalDifference
            )
        );
    }

    async getStandings(tournamentId: string): Promise<Team[]> {
        const teams = await this.prisma.team.findMany({
            where: { tournamentId },
            orderBy: [
                { points: 'desc' },
                { goalDifference: 'desc' },
                { goalsFor: 'desc' },
                { name: 'asc' }
            ]
        });

        return teams.map(
            (t) => new Team(
                t.id, t.name, t.logo, t.foundedYear, t.championshipsWon ?? undefined, t.categoryId ?? undefined, t.tournamentId ?? undefined,
                t.points, t.matchesPlayed, t.matchesWon, t.matchesDrawn, t.matchesLost, t.goalsFor, t.goalsAgainst, t.goalDifference
            )
        );
    }

    async update(team: Team): Promise<Team> {
        const updated = await this.prisma.team.update({
            where: { id: team.id },
            data: {
                name: team.name,
                logo: team.logo,
                foundedYear: team.foundedYear,
                championshipsWon: team.championshipsWon,
                categoryId: team.categoryId,
                tournamentId: team.tournamentId,
                points: team.points,
                matchesPlayed: team.matchesPlayed,
                matchesWon: team.matchesWon,
                matchesDrawn: team.matchesDrawn,
                matchesLost: team.matchesLost,
                goalsFor: team.goalsFor,
                goalsAgainst: team.goalsAgainst,
                goalDifference: team.goalDifference,
            },
        });
        return new Team(
            updated.id,
            updated.name,
            updated.logo,
            updated.foundedYear,
            updated.championshipsWon ?? undefined,
            updated.categoryId ?? undefined,
            updated.tournamentId ?? undefined,
            updated.points,
            updated.matchesPlayed,
            updated.matchesWon,
            updated.matchesDrawn,
            updated.matchesLost,
            updated.goalsFor,
            updated.goalsAgainst,
            updated.goalDifference
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.team.delete({ where: { id } });
    }
}
