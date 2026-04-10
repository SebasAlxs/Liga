"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const CreateTournamentUseCase_1 = require("../../../../../application/use-cases/Tournament/CreateTournamentUseCase");
const PrismaTournamentRepository_1 = require("../../../../db/prisma/repositories/PrismaTournamentRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTournamentRepository_1.PrismaTournamentRepository();
        const useCase = new CreateTournamentUseCase_1.CreateTournamentUseCase(repo);
        const tournament = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, tournament, 201, "Torneo creado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
