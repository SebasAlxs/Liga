"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetAllTournamentsUseCase_1 = require("../../../../../application/use-cases/Tournament/GetAllTournamentsUseCase");
const PrismaTournamentRepository_1 = require("../../../../db/prisma/repositories/PrismaTournamentRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTournamentRepository_1.PrismaTournamentRepository();
        const useCase = new GetAllTournamentsUseCase_1.GetAllTournamentsUseCase(repo);
        const tournaments = await useCase.execute();
        return (0, api_gateway_1.successResponse)(res, tournaments, 200, "Torneos recuperados con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
