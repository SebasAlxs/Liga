"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DeleteMatchUseCase_1 = require("../../../../../application/use-cases/Match/DeleteMatchUseCase");
const PrismaMatchRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaMatchRepository_1.PrismaMatchRepository();
        const useCase = new DeleteMatchUseCase_1.DeleteMatchUseCase(repo);
        await useCase.execute(req.params.id);
        return (0, api_gateway_1.successResponse)(res, null, 200, "Partido eliminado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
