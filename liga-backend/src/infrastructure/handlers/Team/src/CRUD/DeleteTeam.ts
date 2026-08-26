import { Request, Response } from "express";
import { DeleteTeamUseCase } from "../../../../../application/use-cases/Team/DeleteTeamUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new DeleteTeamUseCase(repo);
        await useCase.execute(req.params.id as string, (req as any).user);
        return successResponse(res, null, 200, "Equipo eliminado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
