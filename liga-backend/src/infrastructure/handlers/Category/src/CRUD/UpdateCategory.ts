import { Request, Response } from "express";
import { UpdateCategoryUseCase } from "../../../../../application/use-cases/Category/UpdateCategoryUseCase";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = new PrismaCategoryRepository();
        const useCase = new UpdateCategoryUseCase(repo);
        const category = await useCase.execute(id as string, req.body);
        return successResponse(res, category, 200, "Categoría actualizada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
