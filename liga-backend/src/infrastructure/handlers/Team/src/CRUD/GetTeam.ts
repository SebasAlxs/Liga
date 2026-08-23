import { Request, Response } from "express";
import { GetTeamByIdUseCase } from "../../../../../application/use-cases/Team/GetTeamByIdUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new GetTeamByIdUseCase(repo);
        const team = await useCase.execute(req.params.id as string);
        if (!team) {
            return errorResponse(res, "Team not found", 404);
        }
        return successResponse(res, team, 200, "Equipo obtenido con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
