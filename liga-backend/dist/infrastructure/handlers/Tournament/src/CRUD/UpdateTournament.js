"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UpdateTournamentUseCase_1 = require("../../../../../application/use-cases/Tournament/UpdateTournamentUseCase");
const PrismaTournamentRepository_1 = require("../../../../db/prisma/repositories/PrismaTournamentRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = new PrismaTournamentRepository_1.PrismaTournamentRepository();
        const useCase = new UpdateTournamentUseCase_1.UpdateTournamentUseCase(repo);
        const tournament = await useCase.execute(id, req.body);
        return (0, api_gateway_1.successResponse)(res, tournament, 200, "Torneo actualizado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
