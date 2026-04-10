import { Request, Response } from "express";
import { DeleteTournamentUseCase } from "../../../../../application/use-cases/Tournament/DeleteTournamentUseCase";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = new PrismaTournamentRepository();
        const useCase = new DeleteTournamentUseCase(repo);
        await useCase.execute(id as string);
        return successResponse(res, null, 200, "Torneo eliminado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
