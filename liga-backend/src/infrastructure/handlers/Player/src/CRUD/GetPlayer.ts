import { Request, Response } from "express";
import { GetPlayerByIdUseCase } from "../../../../../application/use-cases/Player/GetPlayerByIdUseCase";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaPlayerRepository();
        const eventRepo = new PrismaMatchEventRepository();
        const useCase = new GetPlayerByIdUseCase(repo, eventRepo);
        const player = await useCase.execute(req.params.id as string);
        if (!player) {
            return errorResponse(res, "Player not found", 404);
        }
        return successResponse(res, player, 200, "Jugador obtenido con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
