"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UpdateTeamUseCase_1 = require("../../../../../application/use-cases/Team/UpdateTeamUseCase");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const useCase = new UpdateTeamUseCase_1.UpdateTeamUseCase(repo);
        const team = await useCase.execute(req.params.id, req.body);
        return (0, api_gateway_1.successResponse)(res, team, 200, "Equipo actualizado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
