import { Request, Response } from "express";
import { GetMatchEventsUseCase } from "../../../../../application/use-cases/MatchEvent/GetMatchEventsUseCase";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchEventRepository();
        const useCase = new GetMatchEventsUseCase(repo);
        const matchId = req.params.matchId;

        if (!matchId) throw new Error("MatchId is required");

        const events = await useCase.execute(matchId as string);
        return successResponse(res, events, 200, "Eventos obtenidos con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
