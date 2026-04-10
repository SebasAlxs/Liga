"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AddPlayerToLineupUseCase_1 = require("../../../../../application/use-cases/MatchLineup/AddPlayerToLineupUseCase");
const PrismaMatchLineupRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchLineupRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaMatchLineupRepository_1.PrismaMatchLineupRepository();
        const useCase = new AddPlayerToLineupUseCase_1.AddPlayerToLineupUseCase(repo);
        const result = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, result, 201, "Jugador agregado a la nómina con éxito.");
    }
    catch (error) {
        console.error("Error in AddPlayerToLineup:", error);
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
