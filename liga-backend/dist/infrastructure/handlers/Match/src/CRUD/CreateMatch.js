"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const CreateMatchUseCase_1 = require("../../../../../application/use-cases/Match/CreateMatchUseCase");
const PrismaMatchRepository_1 = require("../../../../db/prisma/repositories/PrismaMatchRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaMatchRepository_1.PrismaMatchRepository();
        const useCase = new CreateMatchUseCase_1.CreateMatchUseCase(repo);
        const match = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, match, 201, "Partido creado con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
