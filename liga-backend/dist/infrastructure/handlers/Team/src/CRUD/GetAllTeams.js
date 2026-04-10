"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetAllTeamsUseCase_1 = require("../../../../../application/use-cases/Team/GetAllTeamsUseCase");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const useCase = new GetAllTeamsUseCase_1.GetAllTeamsUseCase(repo);
        const teams = await useCase.execute();
        return (0, api_gateway_1.successResponse)(res, teams, 200, "Equipos obtenidos con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
