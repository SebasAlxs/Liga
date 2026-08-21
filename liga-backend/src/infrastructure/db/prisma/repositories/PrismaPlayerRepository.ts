import prisma from "../PrismaClient";
import { Player } from "../../../../domain/entities/Player";
import { PlayerRepository } from "../../../../domain/repositories/PlayerRepository";
import { PaginatedResult, PaginationParams } from "../../../../domain/repositories/Pagination";

export class PrismaPlayerRepository implements PlayerRepository {
    private prisma = prisma;

    async create(player: Player): Promise<Player> {
        const created = await this.prisma.player.create({
            data: {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                number: player.number,
                teamId: player.teamId,
                dni: player.dni,
                birthDate: player.birthDate,
                isLocal: player.isLocal,
                picture: player.picture || null,
            },
        });

        return new Player(
            created.id,
            created.firstName,
            created.lastName,
            created.number,
            created.teamId,
            created.dni ?? undefined,
            created.birthDate ?? undefined,
            created.isLocal,
            created.picture || undefined,
            created.createdAt,
            created.updatedAt
        );
    }

    async findByDni(dni: string): Promise<Player | null> {
        const p = await this.prisma.player.findUnique({ where: { dni } });
        if (!p) return null;
        return new Player(
            p.id,
            p.firstName,
            p.lastName,
            p.number,
            p.teamId,
            p.dni ?? undefined,
            p.birthDate ?? undefined,
            p.isLocal,
            p.picture || undefined,
            p.createdAt,
            p.updatedAt
        );
    }

    async findById(id: string): Promise<Player | null> {
        const player = await this.prisma.player.findUnique({ where: { id } });
        if (!player) return null;
        return new Player(
            player.id,
            player.firstName,
            player.lastName,
            player.number,
            player.teamId,
            player.dni ?? undefined,
            player.birthDate ?? undefined,
            player.isLocal,
            player.picture || undefined,
            player.createdAt,
            player.updatedAt
        );
    }

    async findAll(pagination?: PaginationParams, options?: { includePicture?: boolean }): Promise<PaginatedResult<Player>> {
        const [players, total] = await Promise.all([
            this.prisma.player.findMany({
                skip: pagination?.skip,
                take: pagination?.take,
                select: {
                    id: true, firstName: true, lastName: true, number: true, teamId: true,
                    dni: true, birthDate: true, isLocal: true, createdAt: true, updatedAt: true,
                    // Se excluye del SELECT (no solo de la respuesta) cuando no se pide,
                    // para no transferir el blob base64 de cada jugador innecesariamente.
                    picture: options?.includePicture ? true : false,
                },
            }),
            this.prisma.player.count(),
        ]);
        return {
            items: players.map(
                (p) => new Player(p.id, p.firstName, p.lastName, p.number, p.teamId, p.dni ?? undefined, p.birthDate ?? undefined, p.isLocal, (p as any).picture || undefined, p.createdAt, p.updatedAt)
            ),
            total,
        };
    }

    async update(player: Player): Promise<Player> {
        const updated = await this.prisma.player.update({
            where: { id: player.id },
            data: {
                firstName: player.firstName,
                lastName: player.lastName,
                number: player.number,
                teamId: player.teamId,
                dni: player.dni,
                birthDate: player.birthDate,
                isLocal: player.isLocal,
                picture: player.picture || null,
            },
        });
        return new Player(
            updated.id,
            updated.firstName,
            updated.lastName,
            updated.number,
            updated.teamId,
            updated.dni ?? undefined,
            updated.birthDate ?? undefined,
            updated.isLocal,
            updated.picture || undefined,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.player.delete({ where: { id } });
    }

    async findByTeamId(teamId: string): Promise<Player[]> {
        const players = await this.prisma.player.findMany({ where: { teamId } });
        return players.map(
            (p) => new Player(p.id, p.firstName, p.lastName, p.number, p.teamId, p.dni ?? undefined, p.birthDate ?? undefined, p.isLocal, p.picture || undefined, p.createdAt, p.updatedAt)
        );
    }
}
