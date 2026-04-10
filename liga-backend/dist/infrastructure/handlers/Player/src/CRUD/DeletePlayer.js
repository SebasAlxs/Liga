"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DeletePlayerUseCase_1 = require("../../../../../application/use-cases/Player/DeletePlayerUseCase");
const PrismaPlayerRepository_1 = require("../../../../db/prisma/repositories/PrismaPlayerRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaPlayerRepository_1.PrismaPlayerRepository();
        const useCase = new DeletePlayerUseCase_1.DeletePlayerUseCase(repo);
        await useCase.execute(req.params.id);
        return (0, api_gateway_1.successResponse)(res, null, 200, "Jugador eliminado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
