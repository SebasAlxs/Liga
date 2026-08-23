import { Request, Response } from "express";
import { CreateCategoryUseCase } from "../../../../../application/use-cases/Category/CreateCategoryUseCase";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaCategoryRepository();
        const useCase = new CreateCategoryUseCase(repo);
        const category = await useCase.execute(req.body);
        return successResponse(res, category, 201, "Categoría creada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
