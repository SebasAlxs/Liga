"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetTopScorersUseCase_1 = require("../../../../../application/use-cases/MatchEvent/GetTopScorersUseCase");
const PrismaMatchEventRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchEventRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const eventRepo = new PrismaMatchEventRepository_1.PrismaMatchEventRepository();
        const useCase = new GetTopScorersUseCase_1.GetTopScorersUseCase(eventRepo);
        const tournamentId = req.params.tournamentId;
        const limitStr = req.query.limit;
        const limit = limitStr ? parseInt(limitStr, 10) : 20;
        if (!tournamentId) {
            throw new Error("El ID del torneo es requerido");
        }
        const stats = await useCase.execute(tournamentId, limit);
        return (0, api_gateway_1.successResponse)(res, stats, 200, "Goleadores obtenidos exitosamente.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
