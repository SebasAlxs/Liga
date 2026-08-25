import { Request, Response } from "express";
import { GetPlayerMatchHistoryUseCase } from "../../../../../application/use-cases/Player/GetPlayerMatchHistoryUseCase";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const lineupRepo = new PrismaMatchLineupRepository();
        const matchRepo = new PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository();
        const eventRepo = new PrismaMatchEventRepository();
        const useCase = new GetPlayerMatchHistoryUseCase(lineupRepo, matchRepo, teamRepo, eventRepo);
        const history = await useCase.execute(req.params.id as string);
        return successResponse(res, history, 200, "Historial de partidos obtenido con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
