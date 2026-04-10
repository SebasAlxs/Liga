import { Request, Response } from "express";
import { CreateTeamUseCase } from "../../../../../application/use-cases/Team/CreateTeamUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new CreateTeamUseCase(repo);
        const team = await useCase.execute(req.body);
        return successResponse(res, team, 201, "Equipo creado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
