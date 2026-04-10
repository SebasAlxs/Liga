"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetPlayerByIdUseCase_1 = require("../../../../../application/use-cases/Player/GetPlayerByIdUseCase");
const PrismaPlayerRepository_1 = require("../../../../db/prisma/repositories/PrismaPlayerRepository");
const PrismaMatchEventRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchEventRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaPlayerRepository_1.PrismaPlayerRepository();
        const eventRepo = new PrismaMatchEventRepository_1.PrismaMatchEventRepository();
        const useCase = new GetPlayerByIdUseCase_1.GetPlayerByIdUseCase(repo, eventRepo);
        const player = await useCase.execute(req.params.id);
        if (!player) {
            return (0, api_gateway_1.errorResponse)(res, "Player not found", 404);
        }
        return (0, api_gateway_1.successResponse)(res, player, 200, "Jugador obtenido con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
