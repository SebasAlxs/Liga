import prisma from "../PrismaClient";
import { Stage, StageType } from "../../../../domain/entities/Stage";
import { StageRepository } from "../../../../domain/repositories/StageRepository";
import { StageType as PrismaStageType } from "@prisma/client";

export class PrismaStageRepository implements StageRepository {
    private prisma = prisma;

    async create(stage: Stage): Promise<Stage> {
        const created = await this.prisma.stage.create({
            data: {
                id: stage.id,
                tournamentId: stage.tournamentId,
                name: stage.name,
                type: stage.type as PrismaStageType,
                order: stage.order,
                isTwoLegged: stage.isTwoLegged,
            }
        });
        return new Stage(created.id, created.tournamentId, created.name, created.type as StageType, created.order, created.isTwoLegged, created.createdAt, created.updatedAt);
    }

    async update(stage: Stage): Promise<Stage> {
        const updated = await this.prisma.stage.update({
            where: { id: stage.id },
            data: {
                name: stage.name,
                type: stage.type as PrismaStageType,
                order: stage.order,
                isTwoLegged: stage.isTwoLegged,
            }
        });
        return new Stage(updated.id, updated.tournamentId, updated.name, updated.type as StageType, updated.order, updated.isTwoLegged, updated.createdAt, updated.updatedAt);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.stage.delete({ where: { id } });
    }

    async findByTournament(tournamentId: string): Promise<Stage[]> {
        const items = await this.prisma.stage.findMany({
            where: { tournamentId },
            orderBy: { order: "asc" }
        });
        return items.map(i => new Stage(i.id, i.tournamentId, i.name, i.type as StageType, i.order, i.isTwoLegged, i.createdAt, i.updatedAt));
    }

    async findById(id: string): Promise<Stage | null> {
        const i = await this.prisma.stage.findUnique({ where: { id } });
        if (!i) return null;
        return new Stage(i.id, i.tournamentId, i.name, i.type as StageType, i.order, i.isTwoLegged, i.createdAt, i.updatedAt);
    }
}
