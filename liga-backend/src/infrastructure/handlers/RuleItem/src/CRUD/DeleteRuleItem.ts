
import { Request, Response } from "express";
import { DeleteRuleItemUseCase } from "../../../../../application/use-cases/RuleItem/DeleteRuleItemUseCase";
import { PrismaRuleItemRepository } from "../../../../db/prisma/repositories/PrismaRuleItemRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaRuleItemRepository();
        const useCase = new DeleteRuleItemUseCase(repo);
        await useCase.execute(req.params.id as string);
        return successResponse(res, null, 200, "Regla eliminada con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
