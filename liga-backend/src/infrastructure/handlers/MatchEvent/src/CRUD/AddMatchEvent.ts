import { Request, Response } from "express";
import { AddMatchEventUseCase } from "../../../../../application/use-cases/MatchEvent/AddMatchEventUseCase";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { PrismaSuspensionRepository } from "../../../../db/prisma/repositories/PrismaSuspensionRepository";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { RecalculateTeamStatsUseCase } from "../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const eventRepo = new PrismaMatchEventRepository();
        const suspensionRepo = new PrismaSuspensionRepository();
        const tournamentRepo = new PrismaTournamentRepository();
        const matchRepo = new PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase(teamRepo, matchRepo);
        const useCase = new AddMatchEventUseCase(eventRepo, suspensionRepo, tournamentRepo, matchRepo, statsUseCase);

        // Validate request body basic fields
        if (!req.body.matchId || !req.body.playerId || !req.body.teamId || !req.body.type || !req.body.tournamentId) {
            throw new Error("Faltan parámetros requeridos para el evento (matchId, playerId, teamId, type, tournamentId).");
        }

        const created = await useCase.execute(req.body);
        return successResponse(res, created, 201, "Evento de partido registrado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
