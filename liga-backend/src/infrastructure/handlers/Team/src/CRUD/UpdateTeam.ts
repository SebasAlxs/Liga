import { Request, Response } from "express";
import { UpdateTeamUseCase } from "../../../../../application/use-cases/Team/UpdateTeamUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new UpdateTeamUseCase(repo);
        const team = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, team, 200, "Equipo actualizado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
