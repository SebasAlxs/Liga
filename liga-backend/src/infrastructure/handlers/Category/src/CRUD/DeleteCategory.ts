import { Request, Response } from "express";
import { DeleteCategoryUseCase } from "../../../../../application/use-cases/Category/DeleteCategoryUseCase";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = new PrismaCategoryRepository();
        const useCase = new DeleteCategoryUseCase(repo);
        await useCase.execute(id as string);
        return successResponse(res, null, 200, "Categoría eliminada con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
