"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetMatchByIdUseCase_1 = require("../../../../../application/use-cases/Match/GetMatchByIdUseCase");
const PrismaMatchRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaMatchRepository_1.PrismaMatchRepository();
        const useCase = new GetMatchByIdUseCase_1.GetMatchByIdUseCase(repo);
        const match = await useCase.execute(req.params.id);
        if (!match) {
            return (0, api_gateway_1.errorResponse)(res, "Match not found", 404);
        }
        return (0, api_gateway_1.successResponse)(res, match, 200, "Partido obtenido con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
