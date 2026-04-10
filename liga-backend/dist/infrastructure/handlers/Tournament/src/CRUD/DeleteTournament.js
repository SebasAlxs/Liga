"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DeleteTournamentUseCase_1 = require("../../../../../application/use-cases/Tournament/DeleteTournamentUseCase");
const PrismaTournamentRepository_1 = require("../../../../db/prisma/repositories/PrismaTournamentRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = new PrismaTournamentRepository_1.PrismaTournamentRepository();
        const useCase = new DeleteTournamentUseCase_1.DeleteTournamentUseCase(repo);
        await useCase.execute(id);
        return (0, api_gateway_1.successResponse)(res, null, 200, "Torneo eliminado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
