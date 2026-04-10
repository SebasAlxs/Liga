import { Request, Response } from "express";
import { GetAllTournamentsUseCase } from "../../../../../application/use-cases/Tournament/GetAllTournamentsUseCase";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTournamentRepository();
        const useCase = new GetAllTournamentsUseCase(repo);
        const tournaments = await useCase.execute();
        return successResponse(res, tournaments, 200, "Torneos recuperados con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
