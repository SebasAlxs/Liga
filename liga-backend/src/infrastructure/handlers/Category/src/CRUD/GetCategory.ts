import { Request, Response } from "express";
import { GetCategoryUseCase } from "../../../../../application/use-cases/Category/GetCategoryUseCase";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaCategoryRepository();
        const useCase = new GetCategoryUseCase(repo);
        const category = await useCase.execute(req.params.id as string);
        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }
        return successResponse(res, category, 200, "Categoría obtenida con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};