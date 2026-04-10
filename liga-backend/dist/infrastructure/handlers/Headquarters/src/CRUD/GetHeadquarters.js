"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetHeadquartersUseCase_1 = require("../../../../../application/use-cases/Headquarters/GetHeadquartersUseCase");
const PrismaHeadquartersRepository_1 = require("../../../../db/prisma/repositories/PrismaHeadquartersRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaHeadquartersRepository_1.PrismaHeadquartersRepository();
        const useCase = new GetHeadquartersUseCase_1.GetHeadquartersUseCase(repo);
        const hqs = await useCase.execute();
        return (0, api_gateway_1.successResponse)(res, hqs, 200, "Sedes obtenidas con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
