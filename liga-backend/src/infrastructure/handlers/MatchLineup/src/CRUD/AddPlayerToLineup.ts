import { Request, Response } from "express";
import { AddPlayerToLineupUseCase } from "../../../../../application/use-cases/MatchLineup/AddPlayerToLineupUseCase";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchLineupRepository();
        const useCase = new AddPlayerToLineupUseCase(repo);
        const result = await useCase.execute(req.body);
        return successResponse(res, result, 201, "Jugador agregado a la nómina con éxito.");
    } catch (error: any) {
        console.error("Error in AddPlayerToLineup:", error);
        return errorResponse(res, error.message);
    }
};
