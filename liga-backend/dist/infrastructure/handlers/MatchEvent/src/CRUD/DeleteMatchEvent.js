"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DeleteMatchEventUseCase_1 = require("../../../../../application/use-cases/MatchEvent/DeleteMatchEventUseCase");
const PrismaMatchEventRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchEventRepository");
const PrismaSuspensionRepository_1 = require("../../../../db/prisma/repositories/PrismaSuspensionRepository");
const PrismaMatchRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchRepository");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const RecalculateTeamStatsUseCase_1 = require("../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            throw new Error("El ID del evento es requerido.");
        }
        const eventId = id;
        const eventRepo = new PrismaMatchEventRepository_1.PrismaMatchEventRepository();
        const suspensionRepo = new PrismaSuspensionRepository_1.PrismaSuspensionRepository();
        const matchRepo = new PrismaMatchRepository_1.PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase_1.RecalculateTeamStatsUseCase(teamRepo, matchRepo);
        const useCase = new DeleteMatchEventUseCase_1.DeleteMatchEventUseCase(eventRepo, suspensionRepo, matchRepo, statsUseCase);
        await useCase.execute(eventId);
        return (0, api_gateway_1.successResponse)(res, null, 200, "Evento de partido eliminado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
