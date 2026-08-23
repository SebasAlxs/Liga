import { Request, Response } from "express";
import { UpdateTournamentUseCase } from "../../../../../application/use-cases/Tournament/UpdateTournamentUseCase";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = new PrismaTournamentRepository();
        const useCase = new UpdateTournamentUseCase(repo);
        const tournament = await useCase.execute(id as string, req.body);
        return successResponse(res, tournament, 200, "Torneo actualizado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
