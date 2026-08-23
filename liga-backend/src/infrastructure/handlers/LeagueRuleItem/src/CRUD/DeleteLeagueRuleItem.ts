import { Request, Response } from "express";
import { DeleteLeagueRuleItemUseCase } from "../../../../../application/use-cases/LeagueRuleItem/DeleteLeagueRuleItemUseCase";
import { PrismaLeagueRuleItemRepository } from "../../../../db/prisma/repositories/PrismaLeagueRuleItemRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = new PrismaLeagueRuleItemRepository();
        const useCase = new DeleteLeagueRuleItemUseCase(repo);
        await useCase.execute(id as string);
        return successResponse(res, null, 200, "Regla eliminada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
