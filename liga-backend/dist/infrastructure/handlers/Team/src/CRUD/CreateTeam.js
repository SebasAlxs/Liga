"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const CreateTeamUseCase_1 = require("../../../../../application/use-cases/Team/CreateTeamUseCase");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const useCase = new CreateTeamUseCase_1.CreateTeamUseCase(repo);
        const team = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, team, 201, "Equipo creado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
