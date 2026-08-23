import { Request, Response } from "express";
import { GetMatchByIdUseCase } from "../../../../../application/use-cases/Match/GetMatchByIdUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const useCase = new GetMatchByIdUseCase(repo);
        const match = await useCase.execute(req.params.id as string);
        if (!match) {
            return errorResponse(res, "Match not found", 404);
        }
        return successResponse(res, match, 200, "Partido obtenido con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
