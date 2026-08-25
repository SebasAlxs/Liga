import { Request, Response } from "express";
import { GetPlayerSuspensionsUseCase } from "../../../../../application/use-cases/Suspension/GetPlayerSuspensionsUseCase";
import { GetAllSuspensionsUseCase } from "../../../../../application/use-cases/Suspension/GetAllSuspensionsUseCase";
import { PrismaSuspensionRepository } from "../../../../db/prisma/repositories/PrismaSuspensionRepository";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaSuspensionRepository();
        const playerRepo = new PrismaPlayerRepository();
        const teamRepo = new PrismaTeamRepository();

        const { playerId, tournamentId } = req.query as { playerId: string, tournamentId: string };

        let suspensions;
        if (playerId && tournamentId) {
            const useCase = new GetPlayerSuspensionsUseCase(repo);
            suspensions = await useCase.execute(playerId, tournamentId);
        } else {
            const useCase = new GetAllSuspensionsUseCase(repo, playerRepo, teamRepo);
            suspensions = await useCase.execute();
        }

        return successResponse(res, suspensions, 200, "Sanciones obtenidas con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
