import { Request, Response } from "express";
import { UpdateMatchUseCase } from "../../../../../application/use-cases/Match/UpdateMatchUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaSuspensionRepository } from "../../../../db/prisma/repositories/PrismaSuspensionRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { RecalculateTeamStatsUseCase } from "../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase";
import { ServeTeamSuspensionsUseCase } from "../../../../../application/use-cases/Suspension/ServeTeamSuspensionsUseCase";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository();
        const suspensionRepo = new PrismaSuspensionRepository();
        const lineupRepo = new PrismaMatchLineupRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase(teamRepo, repo);
        const serveTeamSuspensionsUseCase = new ServeTeamSuspensionsUseCase(suspensionRepo, lineupRepo);
        const useCase = new UpdateMatchUseCase(repo, statsUseCase, serveTeamSuspensionsUseCase);
        const result = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, result, 200, "Partido actualizado exitosamente.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
