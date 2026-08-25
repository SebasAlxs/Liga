import prisma from "../PrismaClient";
import { PlayerTeamHistory } from "../../../../domain/entities/PlayerTeamHistory";
import { PlayerTeamHistoryRepository } from "../../../../domain/repositories/PlayerTeamHistoryRepository";

export class PrismaPlayerTeamHistoryRepository implements PlayerTeamHistoryRepository {
    private prisma = prisma;

    async create(playerId: string, teamId: string, startDate: Date = new Date()): Promise<PlayerTeamHistory> {
        const created = await this.prisma.playerTeamHistory.create({
            data: { playerId, teamId, startDate },
        });
        return this.toDomain(created);
    }

    async closeOpenEntry(playerId: string, endDate: Date = new Date()): Promise<void> {
        await this.prisma.playerTeamHistory.updateMany({
            where: { playerId, endDate: null },
            data: { endDate },
        });
    }

    async findByPlayer(playerId: string): Promise<PlayerTeamHistory[]> {
        const entries = await this.prisma.playerTeamHistory.findMany({
            where: { playerId },
            orderBy: { startDate: 'desc' },
        });
        return entries.map(e => this.toDomain(e));
    }

    private toDomain(e: {
        id: string; playerId: string; teamId: string; startDate: Date;
        endDate: Date | null; createdAt: Date; updatedAt: Date;
    }): PlayerTeamHistory {
        return new PlayerTeamHistory(
            e.id, e.playerId, e.teamId, e.startDate, e.endDate ?? undefined, e.createdAt, e.updatedAt
        );
    }
}
