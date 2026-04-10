"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UpdatePlayerUseCase_1 = require("../../../../../application/use-cases/Player/UpdatePlayerUseCase");
const PrismaPlayerRepository_1 = require("../../../../db/prisma/repositories/PrismaPlayerRepository");
const PrismaTeamRepository_1 = require("../../../../db/prisma/repositories/PrismaTeamRepository");
const PrismaCategoryRepository_1 = require("../../../../db/prisma/repositories/PrismaCategoryRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaPlayerRepository_1.PrismaPlayerRepository();
        const teamRepo = new PrismaTeamRepository_1.PrismaTeamRepository();
        const categoryRepo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
        const useCase = new UpdatePlayerUseCase_1.UpdatePlayerUseCase(repo, teamRepo, categoryRepo);
        const player = await useCase.execute(req.params.id, req.body);
        return (0, api_gateway_1.successResponse)(res, player, 200, "Jugador actualizado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
