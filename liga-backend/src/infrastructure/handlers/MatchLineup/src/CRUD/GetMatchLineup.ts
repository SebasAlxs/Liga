import { Request, Response } from "express";
import { GetMatchLineupUseCase } from "../../../../../application/use-cases/MatchLineup/GetMatchLineupUseCase";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const id = req.params.matchId;
        if (!id || typeof id !== 'string') {
            throw new Error("MatchId is required");
        }
        const repo = new PrismaMatchLineupRepository();
        const useCase = new GetMatchLineupUseCase(repo);
        const result = await useCase.execute(id);
        return successResponse(res, result, 200, "Nómina obtenida con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
