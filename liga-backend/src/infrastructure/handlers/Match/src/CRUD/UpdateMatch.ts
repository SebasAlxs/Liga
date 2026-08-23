import { Request, Response } from "express";
import { UpdateMatchUseCase } from "../../../../../application/use-cases/Match/UpdateMatchUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { RecalculateTeamStatsUseCase } from "../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase(teamRepo, repo);
        const useCase = new UpdateMatchUseCase(repo, statsUseCase);
        const match = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, match, 200, "Partido actualizado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
