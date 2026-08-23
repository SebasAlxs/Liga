import { Request, Response } from "express";
import { UpdateHeadquartersUseCase } from "../../../../../application/use-cases/Headquarters/UpdateHeadquartersUseCase";
import { PrismaHeadquartersRepository } from "../../../../db/prisma/repositories/PrismaHeadquartersRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaHeadquartersRepository();
        const useCase = new UpdateHeadquartersUseCase(repo);
        const updated = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, updated, 200, "Sede actualizada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
