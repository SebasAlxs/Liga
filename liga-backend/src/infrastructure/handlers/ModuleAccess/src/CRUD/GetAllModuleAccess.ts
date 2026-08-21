import { Request, Response } from "express";
import { GetAllModuleAccessUseCase } from "../../../../../application/use-cases/ModuleAccess/GetAllModuleAccessUseCase";
import { PrismaModuleAccessRepository } from "../../../../db/prisma/repositories/PrismaModuleAccessRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaModuleAccessRepository();
        const useCase = new GetAllModuleAccessUseCase(repo);
        const data = await useCase.execute();
        return successResponse(res, data, 200, "Configuración de módulos recuperada con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
