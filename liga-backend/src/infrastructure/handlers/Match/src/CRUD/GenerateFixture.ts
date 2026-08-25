import { Request, Response } from "express";
import { GenerateFixtureUseCase } from "../../../../../application/use-cases/Match/GenerateFixtureUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { tournamentId, categoryId, doubleRound } = req.body;
        const useCase = new GenerateFixtureUseCase(
            new PrismaMatchRepository(),
            new PrismaTeamRepository()
        );

        const matches = await useCase.execute({
            tournamentId,
            categoryId,
            doubleRound: !!doubleRound
        });

        return successResponse(res, matches, 201, "Fixture generado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
