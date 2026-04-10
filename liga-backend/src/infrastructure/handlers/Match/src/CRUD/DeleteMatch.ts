import { Request, Response } from "express";
import { DeleteMatchUseCase } from "../../../../../application/use-cases/Match/DeleteMatchUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const useCase = new DeleteMatchUseCase(repo);
        await useCase.execute(req.params.id as string);
        return successResponse(res, null, 200, "Partido eliminado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
