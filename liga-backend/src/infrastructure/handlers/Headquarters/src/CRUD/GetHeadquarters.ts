import { Request, Response } from "express";
import { GetHeadquartersUseCase } from "../../../../../application/use-cases/Headquarters/GetHeadquartersUseCase";
import { PrismaHeadquartersRepository } from "../../../../db/prisma/repositories/PrismaHeadquartersRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaHeadquartersRepository();
        const useCase = new GetHeadquartersUseCase(repo);
        const hqs = await useCase.execute();
        return successResponse(res, hqs, 200, "Sedes obtenidas con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
