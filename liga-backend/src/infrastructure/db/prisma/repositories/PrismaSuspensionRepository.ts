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
                teamId: suspension.teamId,
                fineId: suspension.fineId,
                reason: suspension.reason,
                matchesSuspended: suspension.matchesSuspended,
                status: suspension.status,
            },
        });

        return this.toDomain(created);
    }

    async findByPlayerInTournament(playerId: string, tournamentId: string): Promise<Suspension[]> {
        const suspensions = await this.prisma.suspension.findMany({
            where: { playerId, tournamentId },
            orderBy: { createdAt: 'desc' },
        });

        return suspensions.map(s => this.toDomain(s));
    }

    async updateStatus(id: string, status: SuspensionStatus): Promise<Suspension> {
        const updated = await this.prisma.suspension.update({
            where: { id },
            data: { status },
        });

        return this.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.suspension.delete({ where: { id } });
    }

    async findAll(): Promise<Suspension[]> {
        const suspensions = await this.prisma.suspension.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return suspensions.map(s => this.toDomain(s));
    }

    async deleteByMatch(matchId: string, playerId: string): Promise<void> {
        await this.prisma.suspension.deleteMany({
            where: {
                matchId,
                playerId
            }
        });
    }

    async findActiveByTeamAndTournament(teamId: string, tournamentId: string): Promise<Suspension[]> {
        const suspensions = await this.prisma.suspension.findMany({
            where: { teamId, tournamentId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
        });

        return suspensions.map(s => this.toDomain(s));
    }

    async deleteByFineId(fineId: string): Promise<void> {
        await this.prisma.suspension.deleteMany({ where: { fineId } });
    }

    async serveByFineId(fineId: string): Promise<void> {
        await this.prisma.suspension.updateMany({
            where: { fineId, status: 'ACTIVE' },
            data: { status: 'SERVED' }
        });
    }

    private toDomain(s: {
        id: string; playerId: string; tournamentId: string; reason: string;
        matchesSuspended: number; status: SuspensionStatus; matchId: string | null;
        createdAt: Date; updatedAt: Date; teamId: string | null; fineId: string | null;
    }): Suspension {
        return new Suspension(
            s.id, s.playerId, s.tournamentId, s.reason, s.matchesSuspended, s.status,
            s.matchId ?? undefined, s.createdAt, s.updatedAt, s.teamId ?? undefined, s.fineId ?? undefined
        );
    }
}
