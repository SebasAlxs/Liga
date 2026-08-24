import { Request, Response } from "express";
import { DeleteMatchEventUseCase } from "../../../../../application/use-cases/MatchEvent/DeleteMatchEventUseCase";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { PrismaSuspensionRepository } from "../../../../db/prisma/repositories/PrismaSuspensionRepository";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaFineRepository } from "../../../../db/prisma/repositories/PrismaFineRepository";
import { RecalculateTeamStatsUseCase } from "../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            throw new Error("El ID del evento es requerido.");
        }
        const eventId = id;

        const eventRepo = new PrismaMatchEventRepository();
        const suspensionRepo = new PrismaSuspensionRepository();
        const matchRepo = new PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository();
        const fineRepo = new PrismaFineRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase(teamRepo, matchRepo);
        const useCase = new DeleteMatchEventUseCase(eventRepo, suspensionRepo, matchRepo, statsUseCase, fineRepo);

        await useCase.execute(eventId);
        return successResponse(res, null, 200, "Evento de partido eliminado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
