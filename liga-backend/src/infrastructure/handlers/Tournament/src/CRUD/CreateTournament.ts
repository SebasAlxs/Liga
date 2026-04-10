import { Request, Response } from "express";
import { CreateTournamentUseCase } from "../../../../../application/use-cases/Tournament/CreateTournamentUseCase";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTournamentRepository();
        const useCase = new CreateTournamentUseCase(repo);
        const tournament = await useCase.execute(req.body);
        return successResponse(res, tournament, 201, "Torneo creado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
