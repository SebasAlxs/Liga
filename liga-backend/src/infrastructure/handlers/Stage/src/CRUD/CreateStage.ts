
import { Request, Response } from "express";
import { CreateStageUseCase } from "../../../../../application/use-cases/Stage/CreateStageUseCase";
import { PrismaStageRepository } from "../../../../db/prisma/repositories/PrismaStageRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaStageRepository();
        const useCase = new CreateStageUseCase(repo);
        const data = await useCase.execute(req.body);
        return successResponse(res, data, 201, "Fase creada con éxito");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
