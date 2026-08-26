
import { Request, Response } from "express";
import { GetTournamentRuleItemsUseCase } from "../../../../../application/use-cases/RuleItem/GetTournamentRuleItemsUseCase";
import { PrismaRuleItemRepository } from "../../../../db/prisma/repositories/PrismaRuleItemRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaRuleItemRepository();
        const useCase = new GetTournamentRuleItemsUseCase(repo);
        const data = await useCase.execute(req.params.tournamentId as string);
        return successResponse(res, data, 200, "Reglas obtenidas con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
