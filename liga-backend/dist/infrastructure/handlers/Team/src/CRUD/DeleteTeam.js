"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DeleteTeamUseCase_1 = require("../../../../../application/use-cases/Team/DeleteTeamUseCase");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const useCase = new DeleteTeamUseCase_1.DeleteTeamUseCase(repo);
        await useCase.execute(req.params.id);
        return (0, api_gateway_1.successResponse)(res, null, 200, "Equipo eliminado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
