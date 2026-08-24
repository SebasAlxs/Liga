import { Request, Response } from "express";
import { UpdateMatchUseCase } from "../../../../../application/use-cases/Match/UpdateMatchUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaSuspensionRepository } from "../../../../db/prisma/repositories/PrismaSuspensionRepository";
import { RecalculateTeamStatsUseCase } from "../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase";
import { ServeTeamSuspensionsUseCase } from "../../../../../application/use-cases/Suspension/ServeTeamSuspensionsUseCase";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository();
        const suspensionRepo = new PrismaSuspensionRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase(teamRepo, repo);
        const serveTeamSuspensionsUseCase = new ServeTeamSuspensionsUseCase(suspensionRepo);
        const useCase = new UpdateMatchUseCase(repo, statsUseCase, serveTeamSuspensionsUseCase);
        const match = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, match, 200, "Partido actualizado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
