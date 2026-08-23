import { Request, Response } from "express";
import { GetTopScorersUseCase } from "../../../../../application/use-cases/MatchEvent/GetTopScorersUseCase";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const eventRepo = new PrismaMatchEventRepository();
        const useCase = new GetTopScorersUseCase(eventRepo);

        const tournamentId = req.params.tournamentId as string;
        const limitStr = req.query.limit as string;
        const limit = limitStr ? parseInt(limitStr, 10) : 20;

        if (!tournamentId) {
            throw new Error("El ID del torneo es requerido");
        }

        const stats = await useCase.execute(tournamentId, limit);
        return successResponse(res, stats, 200, "Goleadores obtenidos exitosamente.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
