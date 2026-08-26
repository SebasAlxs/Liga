
import { Request, Response } from "express";
import { GetTournamentStagesUseCase } from "../../../../../application/use-cases/Stage/GetTournamentStagesUseCase";
import { PrismaStageRepository } from "../../../../db/prisma/repositories/PrismaStageRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaStageRepository();
        const useCase = new GetTournamentStagesUseCase(repo);
        const data = await useCase.execute(req.params.tournamentId as string);
        return successResponse(res, data, 200, "Fases obtenidas con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
