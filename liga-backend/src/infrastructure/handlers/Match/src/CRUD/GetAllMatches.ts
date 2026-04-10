import { Request, Response } from "express";
import { GetAllMatchesUseCase } from "../../../../../application/use-cases/Match/GetAllMatchesUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const useCase = new GetAllMatchesUseCase(repo);
        const matches = await useCase.execute();
        return successResponse(res, matches, 200, "Partidos obtenidos con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
