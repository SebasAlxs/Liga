
import { Request, Response } from "express";
import { DeleteStageUseCase } from "../../../../../application/use-cases/Stage/DeleteStageUseCase";
import { PrismaStageRepository } from "../../../../db/prisma/repositories/PrismaStageRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaStageRepository();
        const useCase = new DeleteStageUseCase(repo);
        await useCase.execute(req.params.id as string);
        return successResponse(res, null, 200, "Fase eliminada con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
