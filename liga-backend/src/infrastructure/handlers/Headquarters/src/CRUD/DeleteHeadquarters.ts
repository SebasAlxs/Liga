import { Request, Response } from "express";
import { DeleteHeadquartersUseCase } from "../../../../../application/use-cases/Headquarters/DeleteHeadquartersUseCase";
import { PrismaHeadquartersRepository } from "../../../../db/prisma/repositories/PrismaHeadquartersRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaHeadquartersRepository();
        const useCase = new DeleteHeadquartersUseCase(repo);
        await useCase.execute(req.params.id as string);
        return successResponse(res, null, 200, "Sede eliminada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
