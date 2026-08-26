
import { Request, Response } from "express";
import { CreateRuleItemUseCase } from "../../../../../application/use-cases/RuleItem/CreateRuleItemUseCase";
import { PrismaRuleItemRepository } from "../../../../db/prisma/repositories/PrismaRuleItemRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaRuleItemRepository();
        const useCase = new CreateRuleItemUseCase(repo);
        const data = await useCase.execute(req.body);
        return successResponse(res, data, 201, "Regla creada con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
