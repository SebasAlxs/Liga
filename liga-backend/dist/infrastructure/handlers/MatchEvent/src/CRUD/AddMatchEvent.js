"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AddMatchEventUseCase_1 = require("../../../../../application/use-cases/MatchEvent/AddMatchEventUseCase");
const PrismaMatchEventRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchEventRepository");
const PrismaSuspensionRepository_1 = require("../../../../db/prisma/repositories/PrismaSuspensionRepository");
const PrismaTournamentRepository_1 = require("../../../../db/prisma/repositories/PrismaTournamentRepository");
const PrismaMatchRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchRepository");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const RecalculateTeamStatsUseCase_1 = require("../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const eventRepo = new PrismaMatchEventRepository_1.PrismaMatchEventRepository();
        const suspensionRepo = new PrismaSuspensionRepository_1.PrismaSuspensionRepository();
        const tournamentRepo = new PrismaTournamentRepository_1.PrismaTournamentRepository();
        const matchRepo = new PrismaMatchRepository_1.PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase_1.RecalculateTeamStatsUseCase(teamRepo, matchRepo);
        const useCase = new AddMatchEventUseCase_1.AddMatchEventUseCase(eventRepo, suspensionRepo, tournamentRepo, matchRepo, statsUseCase);
        // Validate request body basic fields
        if (!req.body.matchId || !req.body.playerId || !req.body.teamId || !req.body.type || !req.body.tournamentId) {
            throw new Error("Faltan parámetros requeridos para el evento (matchId, playerId, teamId, type, tournamentId).");
        }
        const created = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, created, 201, "Evento de partido registrado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
