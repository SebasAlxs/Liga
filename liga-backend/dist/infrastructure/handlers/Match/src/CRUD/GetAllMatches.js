"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetAllMatchesUseCase_1 = require("../../../../../application/use-cases/Match/GetAllMatchesUseCase");
const PrismaMatchRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaMatchRepository_1.PrismaMatchRepository();
        const useCase = new GetAllMatchesUseCase_1.GetAllMatchesUseCase(repo);
        const matches = await useCase.execute();
        return (0, api_gateway_1.successResponse)(res, matches, 200, "Partidos obtenidos con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
