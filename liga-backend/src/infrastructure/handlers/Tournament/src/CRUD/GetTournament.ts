import { Request, Response } from "express";
import { GetTournamentUseCase } from "../../../../../application/use-cases/Tournament/GetTournamentUseCase";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTournamentRepository();
        const useCase = new GetTournamentUseCase(repo);
        const tournament = await useCase.execute(req.params.id as string);
        if (!tournament) {
            return errorResponse(res, "Tournament not found", 404);
        }
        return successResponse(res, tournament, 200, "Torneo obtenido con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
