import { Request, Response } from "express";
import { GetAllLeagueRuleItemsUseCase } from "../../../../../application/use-cases/LeagueRuleItem/GetAllLeagueRuleItemsUseCase";
import { PrismaLeagueRuleItemRepository } from "../../../../db/prisma/repositories/PrismaLeagueRuleItemRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaLeagueRuleItemRepository();
        const useCase = new GetAllLeagueRuleItemsUseCase(repo);
        const data = await useCase.execute();
        return successResponse(res, data, 200, "Reglas recuperadas con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
