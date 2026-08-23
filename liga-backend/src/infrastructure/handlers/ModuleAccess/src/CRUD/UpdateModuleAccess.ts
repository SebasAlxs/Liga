import { Request, Response } from "express";
import { UpdateModuleAccessUseCase } from "../../../../../application/use-cases/ModuleAccess/UpdateModuleAccessUseCase";
import { PrismaModuleAccessRepository } from "../../../../db/prisma/repositories/PrismaModuleAccessRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaModuleAccessRepository();
        const useCase = new UpdateModuleAccessUseCase(repo);
        const data = await useCase.execute(req.body);
        return successResponse(res, data, 200, "Configuración de módulos actualizada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
