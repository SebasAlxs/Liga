import { Request, Response } from "express";
import { GetLeagueRulesUseCase } from "../../../../../application/use-cases/LeagueRules/GetLeagueRulesUseCase";
import { PrismaLeagueRulesRepository } from "../../../../db/prisma/repositories/PrismaLeagueRulesRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaLeagueRulesRepository();
        const useCase = new GetLeagueRulesUseCase(repo);
        const data = await useCase.execute();
        return successResponse(res, data, 200, "Reglas del campeonato recuperadas con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
