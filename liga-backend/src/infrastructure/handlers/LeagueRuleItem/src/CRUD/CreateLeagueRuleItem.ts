import { Request, Response } from "express";
import { CreateLeagueRuleItemUseCase } from "../../../../../application/use-cases/LeagueRuleItem/CreateLeagueRuleItemUseCase";
import { PrismaLeagueRuleItemRepository } from "../../../../db/prisma/repositories/PrismaLeagueRuleItemRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaLeagueRuleItemRepository();
        const useCase = new CreateLeagueRuleItemUseCase(repo);
        const data = await useCase.execute(req.body);
        return successResponse(res, data, 201, "Regla creada con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
