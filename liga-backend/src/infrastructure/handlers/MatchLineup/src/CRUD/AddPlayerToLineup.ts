import { Request, Response } from "express";
import { AddPlayerToLineupUseCase } from "../../../../../application/use-cases/MatchLineup/AddPlayerToLineupUseCase";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaSuspensionRepository } from "../../../../db/prisma/repositories/PrismaSuspensionRepository";
import { PrismaFineRepository } from "../../../../db/prisma/repositories/PrismaFineRepository";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchLineupRepository();
        const matchRepo = new PrismaMatchRepository();
        const suspensionRepo = new PrismaSuspensionRepository();
        const fineRepo = new PrismaFineRepository();
        const tournamentRepo = new PrismaTournamentRepository();

        const useCase = new AddPlayerToLineupUseCase(repo, matchRepo, suspensionRepo, fineRepo, tournamentRepo);
        const result = await useCase.execute(req.body);
        return successResponse(res, result, 201, "Jugador agregado a la nómina con éxito.");
    } catch (error: any) {
        console.error("Error in AddPlayerToLineup:", error);
        return handleErrorResponse(res, error);
    }
};
