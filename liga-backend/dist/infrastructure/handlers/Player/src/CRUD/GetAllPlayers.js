"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetAllPlayersUseCase_1 = require("../../../../../application/use-cases/Player/GetAllPlayersUseCase");
const PrismaPlayerRepository_1 = require("../../../../db/prisma/repositories/PrismaPlayerRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaPlayerRepository_1.PrismaPlayerRepository();
        const useCase = new GetAllPlayersUseCase_1.GetAllPlayersUseCase(repo);
        const includePicture = req.query.includePicture === 'true';
        const players = await useCase.execute(includePicture);
        return (0, api_gateway_1.successResponse)(res, players);
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
