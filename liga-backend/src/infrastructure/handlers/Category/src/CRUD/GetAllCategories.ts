import { Request, Response } from "express";
import { GetAllCategoriesUseCase } from "../../../../../application/use-cases/Category/GetAllCategoriesUseCase";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaCategoryRepository();
        const useCase = new GetAllCategoriesUseCase(repo);
        const categories = await useCase.execute();
        return successResponse(res, categories, 200, "Categorías recuperadas con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
