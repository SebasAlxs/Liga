"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTeamRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const Team_1 = require("../../../../domain/entities/Team");
class PrismaTeamRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async create(team) {
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
        return new Team_1.Team(created.id, created.name, created.logo, created.foundedYear, created.championshipsWon ?? undefined, created.categoryId ?? undefined, created.tournamentId ?? undefined, created.points, created.matchesPlayed, created.matchesWon, created.matchesDrawn, created.matchesLost, created.goalsFor, created.goalsAgainst, created.goalDifference);
    }
    async findById(id) {
        const team = await this.prisma.team.findUnique({ where: { id } });
        if (!team)
            return null;
        return new Team_1.Team(team.id, team.name, team.logo, team.foundedYear, team.championshipsWon ?? undefined, team.categoryId ?? undefined, team.tournamentId ?? undefined, team.points, team.matchesPlayed, team.matchesWon, team.matchesDrawn, team.matchesLost, team.goalsFor, team.goalsAgainst, team.goalDifference);
    }
    async findByName(name) {
        const team = await this.prisma.team.findFirst({ where: { name } });
        if (!team)
            return null;
        return new Team_1.Team(team.id, team.name, team.logo, team.foundedYear, team.championshipsWon ?? undefined, team.categoryId ?? undefined, team.tournamentId ?? undefined, team.points, team.matchesPlayed, team.matchesWon, team.matchesDrawn, team.matchesLost, team.goalsFor, team.goalsAgainst, team.goalDifference);
    }
    async findAll() {
        const teams = await this.prisma.team.findMany();
        return teams.map((t) => new Team_1.Team(t.id, t.name, t.logo, t.foundedYear, t.championshipsWon ?? undefined, t.categoryId ?? undefined, t.tournamentId ?? undefined, t.points, t.matchesPlayed, t.matchesWon, t.matchesDrawn, t.matchesLost, t.goalsFor, t.goalsAgainst, t.goalDifference));
    }
    async getStandings(tournamentId) {
        const teams = await this.prisma.team.findMany({
            where: { tournamentId },
            orderBy: [
                { points: 'desc' },
                { goalDifference: 'desc' },
                { goalsFor: 'desc' },
                { name: 'asc' }
            ]
        });
        return teams.map((t) => new Team_1.Team(t.id, t.name, t.logo, t.foundedYear, t.championshipsWon ?? undefined, t.categoryId ?? undefined, t.tournamentId ?? undefined, t.points, t.matchesPlayed, t.matchesWon, t.matchesDrawn, t.matchesLost, t.goalsFor, t.goalsAgainst, t.goalDifference));
    }
    async update(team) {
        const updated = await this.prisma.team.update({
            where: { id: team.id },
            data: {
                name: team.name,
                logo: team.logo,
                foundedYear: team.foundedYear,
                championshipsWon: team.championshipsWon,
                categoryId: team.categoryId,
                tournamentId: team.tournamentId,
            },
        });
        return new Team_1.Team(updated.id, updated.name, updated.logo, updated.foundedYear, updated.championshipsWon ?? undefined, updated.categoryId ?? undefined, updated.tournamentId ?? undefined, updated.points, updated.matchesPlayed, updated.matchesWon, updated.matchesDrawn, updated.matchesLost, updated.goalsFor, updated.goalsAgainst, updated.goalDifference);
    }
    async delete(id) {
        await this.prisma.team.delete({ where: { id } });
    }
}
exports.PrismaTeamRepository = PrismaTeamRepository;
