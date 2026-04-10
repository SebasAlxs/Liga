import prisma from "../PrismaClient";
import { Suspension, SuspensionStatus } from "../../../../domain/entities/Suspension";
import { SuspensionRepository } from "../../../../domain/repositories/SuspensionRepository";

export class PrismaSuspensionRepository implements SuspensionRepository {
    private prisma = prisma;

    async create(suspension: Suspension): Promise<Suspension> {
        const created = await this.prisma.suspension.create({
            data: {
                id: suspension.id,
                playerId: suspension.playerId,
                tournamentId: suspension.tournamentId,
                matchId: suspension.matchId,
                reason: suspension.reason,
                matchesSuspended: suspension.matchesSuspended,
                status: suspension.status,
            },
        });

        return new Suspension(created.id, created.playerId, created.tournamentId, created.reason, created.matchesSuspended, created.status, created.matchId ?? undefined, created.createdAt, created.updatedAt);
    }

    async findByPlayerInTournament(playerId: string, tournamentId: string): Promise<Suspension[]> {
        const suspensions = await this.prisma.suspension.findMany({
            where: { playerId, tournamentId },
            orderBy: { createdAt: 'desc' },
        });

        return suspensions.map(s => new Suspension(s.id, s.playerId, s.tournamentId, s.reason, s.matchesSuspended, s.status, s.matchId ?? undefined, s.createdAt, s.updatedAt));
    }

    async updateStatus(id: string, status: SuspensionStatus): Promise<Suspension> {
        const updated = await this.prisma.suspension.update({
            where: { id },
            data: { status },
        });

        return new Suspension(updated.id, updated.playerId, updated.tournamentId, updated.reason, updated.matchesSuspended, updated.status, updated.matchId ?? undefined, updated.createdAt, updated.updatedAt);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.suspension.delete({ where: { id } });
    }

    async deleteByMatch(matchId: string, playerId: string): Promise<void> {
        await this.prisma.suspension.deleteMany({
            where: {
                matchId,
                playerId
            }
        });
    }
}
