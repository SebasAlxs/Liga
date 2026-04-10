"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetMatchEventsUseCase_1 = require("../../../../../application/use-cases/MatchEvent/GetMatchEventsUseCase");
const PrismaMatchEventRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchEventRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaMatchEventRepository_1.PrismaMatchEventRepository();
        const useCase = new GetMatchEventsUseCase_1.GetMatchEventsUseCase(repo);
        const matchId = req.params.matchId;
        if (!matchId)
            throw new Error("MatchId is required");
        const events = await useCase.execute(matchId);
        return (0, api_gateway_1.successResponse)(res, events, 200, "Eventos obtenidos con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
