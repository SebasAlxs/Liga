import { Request, Response } from "express";
import { GetVisibleModulesForRoleUseCase } from "../../../../../application/use-cases/ModuleAccess/GetVisibleModulesForRoleUseCase";
import { PrismaModuleAccessRepository } from "../../../../db/prisma/repositories/PrismaModuleAccessRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const role = (req as any).user?.role;
        if (!role) {
            return errorResponse(res, "No autorizado.", 401);
        }
        const repo = new PrismaModuleAccessRepository();
        const useCase = new GetVisibleModulesForRoleUseCase(repo);
        const data = await useCase.execute(role);
        return successResponse(res, data, 200, "Módulos visibles recuperados con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
