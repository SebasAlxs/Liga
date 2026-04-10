"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetPlayerSuspensionsUseCase_1 = require("../../../../../application/use-cases/Suspension/GetPlayerSuspensionsUseCase");
const PrismaSuspensionRepository_1 = require("../../../../db/prisma/repositories/PrismaSuspensionRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaSuspensionRepository_1.PrismaSuspensionRepository();
        const useCase = new GetPlayerSuspensionsUseCase_1.GetPlayerSuspensionsUseCase(repo);
        const { playerId, tournamentId } = req.query;
        if (!playerId || !tournamentId) {
            throw new Error("Se requiere playerId y tournamentId para buscar suspensiones.");
        }
        const suspensions = await useCase.execute(playerId, tournamentId);
        return (0, api_gateway_1.successResponse)(res, suspensions, 200, "Sanciones obtenidas con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
