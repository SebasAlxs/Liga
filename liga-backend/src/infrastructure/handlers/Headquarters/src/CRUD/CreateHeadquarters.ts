import { Request, Response } from "express";
import { CreateHeadquartersUseCase } from "../../../../../application/use-cases/Headquarters/CreateHeadquartersUseCase";
import { PrismaHeadquartersRepository } from "../../../../db/prisma/repositories/PrismaHeadquartersRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaHeadquartersRepository();
        const useCase = new CreateHeadquartersUseCase(repo);
        const created = await useCase.execute(req.body);
        return successResponse(res, created, 201, "Sede creada con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
