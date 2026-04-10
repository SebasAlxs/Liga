import { Request, Response } from "express";
import { GetAllTeamsUseCase } from "../../../../../application/use-cases/Team/GetAllTeamsUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new GetAllTeamsUseCase(repo);
        const teams = await useCase.execute();
        return successResponse(res, teams, 200, "Equipos obtenidos con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
