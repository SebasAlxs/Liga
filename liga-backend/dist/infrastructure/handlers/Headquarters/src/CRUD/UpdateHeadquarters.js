"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UpdateHeadquartersUseCase_1 = require("../../../../../application/use-cases/Headquarters/UpdateHeadquartersUseCase");
const PrismaHeadquartersRepository_1 = require("../../../../db/prisma/repositories/PrismaHeadquartersRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaHeadquartersRepository_1.PrismaHeadquartersRepository();
        const useCase = new UpdateHeadquartersUseCase_1.UpdateHeadquartersUseCase(repo);
        const updated = await useCase.execute(req.params.id, req.body);
        return (0, api_gateway_1.successResponse)(res, updated, 200, "Sede actualizada con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
