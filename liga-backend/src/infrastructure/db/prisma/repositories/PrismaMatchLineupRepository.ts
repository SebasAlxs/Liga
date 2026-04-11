import { LineupStatus as PrismaLineupStatus } from "@prisma/client";
import prisma from "../PrismaClient";
import { MatchLineup, LineupStatus } from "../../../../domain/entities/MatchLineup";
import { MatchLineupRepository } from "../../../../domain/repositories/MatchLineupRepository";

export class PrismaMatchLineupRepository implements MatchLineupRepository {
    private prisma = prisma;

    async create(lineup: MatchLineup): Promise<MatchLineup> {
        try {
            console.log("Creating MatchLineup with data:", lineup);
            const created = await this.prisma.matchLineup.create({
                data: {
                    id: lineup.id,
                    matchId: lineup.matchId,
                    playerId: lineup.playerId,
                    teamId: lineup.teamId,
                    status: lineup.status as PrismaLineupStatus,
                    checkedIn: lineup.checkedIn,
                    number: lineup.number ?? undefined,
                },
            });
            return this.mapToEntity(created);
        } catch (error) {
            console.error("Prisma error creating MatchLineup:", error);
            throw error;
        }
    }

    async findById(id: string): Promise<MatchLineup | null> {
        const item = await this.prisma.matchLineup.findUnique({ where: { id } });
        return item ? this.mapToEntity(item) : null;
    }

    async findByMatchAndPlayer(matchId: string, playerId: string): Promise<MatchLineup | null> {
        const item = await this.prisma.matchLineup.findFirst({
            where: { matchId, playerId }
        });
        return item ? this.mapToEntity(item) : null;
    }

    async findByMatch(matchId: string): Promise<MatchLineup[]> {
        const items = await this.prisma.matchLineup.findMany({
            where: { matchId }
        });
        return items.map(item => this.mapToEntity(item));
    }

    async update(lineup: MatchLineup): Promise<MatchLineup> {
        const updated = await this.prisma.matchLineup.update({
            where: { id: lineup.id },
            data: {
                status: lineup.status as PrismaLineupStatus,
                checkedIn: lineup.checkedIn,
                number: lineup.number ?? undefined,
            },
        });
        return this.mapToEntity(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.matchLineup.delete({ where: { id } });
    }

    private mapToEntity(data: any): MatchLineup {
        return new MatchLineup(
            data.id,
            data.matchId,
            data.playerId,
            data.teamId,
            data.status as LineupStatus,
            data.checkedIn,
            data.number
        );
    }
}
