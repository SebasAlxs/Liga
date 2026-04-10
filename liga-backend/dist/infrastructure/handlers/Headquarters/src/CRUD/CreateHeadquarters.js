"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const CreateHeadquartersUseCase_1 = require("../../../../../application/use-cases/Headquarters/CreateHeadquartersUseCase");
const PrismaHeadquartersRepository_1 = require("../../../../db/prisma/repositories/PrismaHeadquartersRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaHeadquartersRepository_1.PrismaHeadquartersRepository();
        const useCase = new CreateHeadquartersUseCase_1.CreateHeadquartersUseCase(repo);
        const created = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, created, 201, "Sede creada con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
