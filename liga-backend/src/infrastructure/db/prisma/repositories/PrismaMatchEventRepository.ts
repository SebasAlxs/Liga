import { EventType } from "@prisma/client";
import prisma from "../PrismaClient";
import { MatchEvent } from "../../../../domain/entities/MatchEvent";
import { MatchEventRepository } from "../../../../domain/repositories/MatchEventRepository";

export class PrismaMatchEventRepository implements MatchEventRepository {
    private prisma = prisma;

    async create(event: MatchEvent): Promise<MatchEvent> {
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

        return new MatchEvent(created.id, created.matchId, created.playerId, created.teamId, created.type, created.minute ?? undefined, created.relatedPlayerId ?? undefined, created.createdAt, created.updatedAt);
    }

    async findByMatch(matchId: string): Promise<MatchEvent[]> {
        const events = await this.prisma.matchEvent.findMany({
            where: { matchId },
            orderBy: { createdAt: 'asc' },
        });
        return events.map(e => new MatchEvent(e.id, e.matchId, e.playerId, e.teamId, e.type, e.minute ?? undefined, e.relatedPlayerId ?? undefined, e.createdAt, e.updatedAt));
    }

    async findById(id: string): Promise<MatchEvent | null> {
        const e = await this.prisma.matchEvent.findUnique({
            where: { id },
        });
        if (!e) return null;
        return new MatchEvent(e.id, e.matchId, e.playerId, e.teamId, e.type, e.minute ?? undefined, e.relatedPlayerId ?? undefined, e.createdAt, e.updatedAt);
    }

    async countYellowCardsInTournament(playerId: string, tournamentId: string): Promise<number> {
        const count = await this.prisma.matchEvent.count({
            where: {
                playerId,
                type: EventType.YELLOW_CARD,
                match: {
                    tournamentId: tournamentId,
                },
            },
        });
        return count;
    }

    async countYellowCardsInMatch(playerId: string, matchId: string): Promise<number> {
        const count = await this.prisma.matchEvent.count({
            where: {
                playerId,
                matchId,
                type: EventType.YELLOW_CARD,
            },
        });
        return count;
    }

    async hasRedCardInMatch(playerId: string, matchId: string): Promise<boolean> {
        const count = await this.prisma.matchEvent.count({
            where: {
                playerId,
                matchId,
                type: EventType.RED_CARD,
            },
        });
        return count > 0;
    }

    async getTopScorers(tournamentId: string, limit: number = 20): Promise<any[]> {
        const scorers = await this.prisma.matchEvent.groupBy({
            by: ['playerId', 'teamId'],
            where: {
                type: EventType.GOAL,
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

        // groupBy no soporta include, pero podemos traer jugadores y equipos en dos consultas batch
        // en vez de una por cada scorer.
        const playerIds = [...new Set(scorers.map(s => s.playerId))];
        const teamIds = [...new Set(scorers.map(s => s.teamId))];

        const [players, teams] = await Promise.all([
            this.prisma.player.findMany({ where: { id: { in: playerIds } } }),
            this.prisma.team.findMany({ where: { id: { in: teamIds } } }),
        ]);

        const playerById = new Map(players.map(p => [p.id, p]));
        const teamById = new Map(teams.map(t => [t.id, t]));

        const enrichedScorers = scorers.map((score) => {
            const player = playerById.get(score.playerId);
            const team = teamById.get(score.teamId);
            return {
                playerId: score.playerId,
                playerName: player ? `${player.firstName} ${player.lastName}` : "Desconocido",
                teamId: score.teamId,
                teamName: team ? team.name : "Desconocido",
                goals: score._count.id
            }
        });

        return enrichedScorers.sort((a, b) => b.goals - a.goals);
    }

    async getPlayerStats(playerId: string): Promise<{ goals: number; yellowCards: number; redCards: number }> {
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
            if (event.type === EventType.GOAL) stats.goals = event._count.id;
            if (event.type === EventType.YELLOW_CARD) stats.yellowCards = event._count.id;
            if (event.type === EventType.RED_CARD) stats.redCards = event._count.id;
        });

        return stats;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.matchEvent.delete({ where: { id } });
    }
}
