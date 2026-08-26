
import { Request, Response } from "express";
import { UpdateRuleItemUseCase } from "../../../../../application/use-cases/RuleItem/UpdateRuleItemUseCase";
import { PrismaRuleItemRepository } from "../../../../db/prisma/repositories/PrismaRuleItemRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaRuleItemRepository();
        const useCase = new UpdateRuleItemUseCase(repo);
        const data = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, data, 200, "Regla actualizada con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
