"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const PrismaPlayerRepository_1 = require("../../../../db/prisma/repositories/PrismaPlayerRepository");
const GetPlayersByTeamUseCase_1 = require("../../../../../application/use-cases/Player/GetPlayersByTeamUseCase");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const includePicture = req.query.includePicture === 'true';
        const repo = new PrismaPlayerRepository_1.PrismaPlayerRepository();
        const useCase = new GetPlayersByTeamUseCase_1.GetPlayersByTeamUseCase(repo);
        const players = await useCase.execute(teamId, includePicture);
        return (0, api_gateway_1.successResponse)(res, players);
    }
    catch (error) {
        console.error("Error in GetPlayersByTeam:", error);
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
