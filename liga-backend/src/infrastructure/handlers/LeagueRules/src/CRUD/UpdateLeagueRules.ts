import { Request, Response } from "express";
import { UpdateLeagueRulesUseCase } from "../../../../../application/use-cases/LeagueRules/UpdateLeagueRulesUseCase";
import { PrismaLeagueRulesRepository } from "../../../../db/prisma/repositories/PrismaLeagueRulesRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaLeagueRulesRepository();
        const useCase = new UpdateLeagueRulesUseCase(repo);
        const data = await useCase.execute(req.body);
        return successResponse(res, data, 200, "Reglas del campeonato actualizadas con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
