import { Request, Response } from "express";
import { CreateMatchUseCase } from "../../../../../application/use-cases/Match/CreateMatchUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const useCase = new CreateMatchUseCase(repo);
        const match = await useCase.execute(req.body);
        return successResponse(res, match, 201, "Partido creado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
