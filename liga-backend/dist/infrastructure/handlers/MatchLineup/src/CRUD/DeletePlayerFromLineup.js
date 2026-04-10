"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DeletePlayerFromLineupUseCase_1 = require("../../../../../application/use-cases/MatchLineup/DeletePlayerFromLineupUseCase");
const PrismaMatchLineupRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchLineupRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            throw new Error("ID is required");
        }
        const repo = new PrismaMatchLineupRepository_1.PrismaMatchLineupRepository();
        const useCase = new DeletePlayerFromLineupUseCase_1.DeletePlayerFromLineupUseCase(repo);
        await useCase.execute(id);
        return (0, api_gateway_1.successResponse)(res, null, 200, "Jugador removido de la nómina con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
