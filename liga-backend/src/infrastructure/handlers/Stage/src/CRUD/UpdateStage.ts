
import { Request, Response } from "express";
import { UpdateStageUseCase } from "../../../../../application/use-cases/Stage/UpdateStageUseCase";
import { PrismaStageRepository } from "../../../../db/prisma/repositories/PrismaStageRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaStageRepository();
        const useCase = new UpdateStageUseCase(repo);
        const data = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, data, 200, "Fase actualizada con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
