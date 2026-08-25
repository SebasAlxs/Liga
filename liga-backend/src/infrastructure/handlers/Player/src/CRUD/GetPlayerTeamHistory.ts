import { Request, Response } from "express";
import { GetPlayerTeamHistoryUseCase } from "../../../../../application/use-cases/Player/GetPlayerTeamHistoryUseCase";
import { PrismaPlayerTeamHistoryRepository } from "../../../../db/prisma/repositories/PrismaPlayerTeamHistoryRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const historyRepo = new PrismaPlayerTeamHistoryRepository();
        const teamRepo = new PrismaTeamRepository();
        const useCase = new GetPlayerTeamHistoryUseCase(historyRepo, teamRepo);
        const history = await useCase.execute(req.params.id as string);
        return successResponse(res, history, 200, "Historial de equipos obtenido con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
