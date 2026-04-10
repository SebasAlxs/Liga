"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMatchEventRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const MatchEvent_1 = require("../../../../domain/entities/MatchEvent"); // will export it later correctly
class PrismaMatchEventRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async create(event) {
        const created = await this.prisma.matchEvent.create({
            data: {
                id: event.id,
                matchId: event.matchId,
                playerId: event.playerId,
                teamId: event.teamId,
                type: event.type,
                minute: event.minute,
                relatedPlayerId: event.relatedPlayerId,
            },
        });
        return new MatchEvent_1.MatchEvent(created.id, created.matchId, created.playerId, created.teamId, created.type, created.minute ?? undefined, created.relatedPlayerId ?? undefined, created.createdAt, created.updatedAt);
    }
    async findByMatch(matchId) {
        const events = await this.prisma.matchEvent.findMany({
            where: { matchId },
            orderBy: { createdAt: 'asc' },
        });
        return events.map(e => new MatchEvent_1.MatchEvent(e.id, e.matchId, e.playerId, e.teamId, e.type, e.minute ?? undefined, e.relatedPlayerId ?? undefined, e.createdAt, e.updatedAt));
    }
    async findById(id) {
        const e = await this.prisma.matchEvent.findUnique({
            where: { id },
        });
        if (!e)
            return null;
        return new MatchEvent_1.MatchEvent(e.id, e.matchId, e.playerId, e.teamId, e.type, e.minute ?? undefined, e.relatedPlayerId ?? undefined, e.createdAt, e.updatedAt);
    }
    async countYellowCardsInTournament(playerId, tournamentId) {
        const count = await this.prisma.matchEvent.count({
            where: {
                playerId,
                type: MatchEvent_1.EventType.YELLOW_CARD,
                match: {
                    tournamentId: tournamentId,
                },
            },
        });
        return count;
    }
    async getTopScorers(tournamentId, limit = 20) {
        const scorers = await this.prisma.matchEvent.groupBy({
            by: ['playerId', 'teamId'],
            where: {
                type: MatchEvent_1.EventType.GOAL,
                match: {
                    tournamentId: tournamentId
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: limit
        });
        // We need to fetch player info and team info manually since groupBy doesn't allow include
        const enrichedScorers = await Promise.all(scorers.map(async (score) => {
            const player = await this.prisma.player.findUnique({ where: { id: score.playerId } });
            const team = await this.prisma.team.findUnique({ where: { id: score.teamId } });
            return {
                playerId: score.playerId,
                playerName: player ? `${player.firstName} ${player.lastName}` : "Desconocido",
                teamId: score.teamId,
                teamName: team ? team.name : "Desconocido",
                goals: score._count.id
            };
        }));
        return enrichedScorers.sort((a, b) => b.goals - a.goals);
    }
    async getPlayerStats(playerId) {
        const events = await this.prisma.matchEvent.groupBy({
            by: ['type'],
            where: { playerId },
            _count: {
                id: true
            }
        });
        const stats = {
            goals: 0,
            yellowCards: 0,
            redCards: 0
        };
        events.forEach(event => {
            if (event.type === MatchEvent_1.EventType.GOAL)
                stats.goals = event._count.id;
            if (event.type === MatchEvent_1.EventType.YELLOW_CARD)
                stats.yellowCards = event._count.id;
            if (event.type === MatchEvent_1.EventType.RED_CARD)
                stats.redCards = event._count.id;
        });
        return stats;
    }
    async delete(id) {
        await this.prisma.matchEvent.delete({ where: { id } });
    }
}
exports.PrismaMatchEventRepository = PrismaMatchEventRepository;
