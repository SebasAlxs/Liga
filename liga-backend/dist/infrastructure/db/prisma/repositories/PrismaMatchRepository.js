"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMatchRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const Match_1 = require("../../../../domain/entities/Match");
class PrismaMatchRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async create(match) {
        const created = await this.prisma.match.create({
            data: {
                id: match.id,
                homeTeamId: match.homeTeamId,
                awayTeamId: match.awayTeamId,
                homeScore: match.homeScore ?? undefined,
                awayScore: match.awayScore ?? undefined,
                matchDate: match.matchDate,
                tournamentId: match.tournamentId,
                categoryId: match.categoryId,
                status: match.status,
            },
        });
        return new Match_1.Match(created.id, created.homeTeamId, created.awayTeamId, created.homeScore, created.awayScore, created.matchDate, created.tournamentId, created.categoryId, created.status);
    }
    async findById(id) {
        const match = await this.prisma.match.findUnique({ where: { id } });
        if (!match)
            return null;
        return new Match_1.Match(match.id, match.homeTeamId, match.awayTeamId, match.homeScore, match.awayScore, match.matchDate, match.tournamentId, match.categoryId, match.status);
    }
    async findAll() {
        const matches = await this.prisma.match.findMany();
        return matches.map((m) => new Match_1.Match(m.id, m.homeTeamId, m.awayTeamId, m.homeScore, m.awayScore, m.matchDate, m.tournamentId, m.categoryId, m.status));
    }
    async update(match) {
        const updated = await this.prisma.match.update({
            where: { id: match.id },
            data: {
                homeTeamId: match.homeTeamId,
                awayTeamId: match.awayTeamId,
                homeScore: match.homeScore ?? undefined,
                awayScore: match.awayScore ?? undefined,
                matchDate: match.matchDate,
                tournamentId: match.tournamentId,
                categoryId: match.categoryId,
                status: match.status,
            },
        });
        return new Match_1.Match(updated.id, updated.homeTeamId, updated.awayTeamId, updated.homeScore, updated.awayScore, updated.matchDate, updated.tournamentId, updated.categoryId, updated.status);
    }
    async delete(id) {
        await this.prisma.match.delete({ where: { id } });
    }
}
exports.PrismaMatchRepository = PrismaMatchRepository;
