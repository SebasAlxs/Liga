import { Request, Response } from "express";
import { DeletePlayerUseCase } from "../../../../../application/use-cases/Player/DeletePlayerUseCase";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaPlayerRepository();
        const useCase = new DeletePlayerUseCase(repo);
        await useCase.execute(req.params.id as string);
        return successResponse(res, null, 200, "Jugador eliminado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
