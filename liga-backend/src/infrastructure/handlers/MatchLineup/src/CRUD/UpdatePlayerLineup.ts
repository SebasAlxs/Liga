import { Request, Response } from "express";
import { CheckInPlayerUseCase } from "../../../../../application/use-cases/MatchLineup/CheckInPlayerUseCase";
import { UpdateLineupStatusUseCase } from "../../../../../application/use-cases/MatchLineup/UpdateLineupStatusUseCase";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            throw new Error("ID is required");
        }
        
        const repo = new PrismaMatchLineupRepository();
        const { checkedIn, status } = req.body;
        
        let result;
        if (checkedIn !== undefined) {
            const useCase = new CheckInPlayerUseCase(repo);
            result = await useCase.execute(id, checkedIn);
        } else if (status !== undefined) {
            const useCase = new UpdateLineupStatusUseCase(repo);
            result = await useCase.execute(id, status);
        } else {
            throw new Error("No update data provided (checkedIn or status)");
        }

        return successResponse(res, result, 200, "Nómina actualizada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
