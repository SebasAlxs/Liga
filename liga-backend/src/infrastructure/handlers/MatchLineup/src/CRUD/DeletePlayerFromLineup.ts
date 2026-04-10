import { Request, Response } from "express";
import { DeletePlayerFromLineupUseCase } from "../../../../../application/use-cases/MatchLineup/DeletePlayerFromLineupUseCase";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            throw new Error("ID is required");
        }
        const repo = new PrismaMatchLineupRepository();
        const useCase = new DeletePlayerFromLineupUseCase(repo);
        await useCase.execute(id);
        return successResponse(res, null, 200, "Jugador removido de la nómina con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
