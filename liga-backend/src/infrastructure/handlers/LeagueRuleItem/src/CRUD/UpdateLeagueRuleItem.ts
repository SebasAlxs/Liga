import { Request, Response } from "express";
import { UpdateLeagueRuleItemUseCase } from "../../../../../application/use-cases/LeagueRuleItem/UpdateLeagueRuleItemUseCase";
import { PrismaLeagueRuleItemRepository } from "../../../../db/prisma/repositories/PrismaLeagueRuleItemRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = new PrismaLeagueRuleItemRepository();
        const useCase = new UpdateLeagueRuleItemUseCase(repo);
        const data = await useCase.execute(id as string, req.body);
        return successResponse(res, data, 200, "Regla actualizada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
