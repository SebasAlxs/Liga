"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UpdateMatchUseCase_1 = require("../../../../../application/use-cases/Match/UpdateMatchUseCase");
const PrismaMatchRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchRepository");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const RecalculateTeamStatsUseCase_1 = require("../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaMatchRepository_1.PrismaMatchRepository();
        const teamRepo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const statsUseCase = new RecalculateTeamStatsUseCase_1.RecalculateTeamStatsUseCase(teamRepo, repo);
        const useCase = new UpdateMatchUseCase_1.UpdateMatchUseCase(repo, statsUseCase);
        const match = await useCase.execute(req.params.id, req.body);
        return (0, api_gateway_1.successResponse)(res, match, 200, "Partido actualizado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
