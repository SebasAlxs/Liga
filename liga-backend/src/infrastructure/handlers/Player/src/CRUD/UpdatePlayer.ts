import { Request, Response } from "express";
import { UpdatePlayerUseCase } from "../../../../../application/use-cases/Player/UpdatePlayerUseCase";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaPlayerRepository();
        const teamRepo = new PrismaTeamRepository();
        const categoryRepo = new PrismaCategoryRepository();
        const useCase = new UpdatePlayerUseCase(repo, teamRepo, categoryRepo);
        const player = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, player, 200, "Jugador actualizado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
