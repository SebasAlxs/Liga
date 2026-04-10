import { Request, Response } from "express";
import { GetPlayerSuspensionsUseCase } from "../../../../../application/use-cases/Suspension/GetPlayerSuspensionsUseCase";
import { PrismaSuspensionRepository } from "../../../../db/prisma/repositories/PrismaSuspensionRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaSuspensionRepository();
        const useCase = new GetPlayerSuspensionsUseCase(repo);

        const { playerId, tournamentId } = req.query as { playerId: string, tournamentId: string };

        if (!playerId || !tournamentId) {
            throw new Error("Se requiere playerId y tournamentId para buscar suspensiones.");
        }

        const suspensions = await useCase.execute(playerId, tournamentId);
        return successResponse(res, suspensions, 200, "Sanciones obtenidas con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
