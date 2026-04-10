"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetTournamentUseCase_1 = require("../../../../../application/use-cases/Tournament/GetTournamentUseCase");
const PrismaTournamentRepository_1 = require("../../../../db/prisma/repositories/PrismaTournamentRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTournamentRepository_1.PrismaTournamentRepository();
        const useCase = new GetTournamentUseCase_1.GetTournamentUseCase(repo);
        const tournament = await useCase.execute(req.params.id);
        if (!tournament) {
            return (0, api_gateway_1.errorResponse)(res, "Tournament not found", 404);
        }
        return (0, api_gateway_1.successResponse)(res, tournament, 200, "Torneo obtenido con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
