"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetMatchLineupUseCase_1 = require("../../../../../application/use-cases/MatchLineup/GetMatchLineupUseCase");
const PrismaMatchLineupRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchLineupRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const id = req.params.matchId;
        if (!id || typeof id !== 'string') {
            throw new Error("MatchId is required");
        }
        const repo = new PrismaMatchLineupRepository_1.PrismaMatchLineupRepository();
        const useCase = new GetMatchLineupUseCase_1.GetMatchLineupUseCase(repo);
        const result = await useCase.execute(id);
        return (0, api_gateway_1.successResponse)(res, result, 200, "Nómina obtenida con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
