import { Request, Response } from "express";
import { GenerateFixtureUseCase } from "../../../../../application/use-cases/Match/GenerateFixtureUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaStageRepository } from "../../../../db/prisma/repositories/PrismaStageRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { tournamentId, categoryId, stageId } = req.body;
        const useCase = new GenerateFixtureUseCase(
            new PrismaMatchRepository(),
            new PrismaTeamRepository(),
            new PrismaStageRepository()
        );

        const matches = await useCase.execute({
            tournamentId,
            categoryId,
            stageId
        });

        return successResponse(res, matches, 201, "Fixture generado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
