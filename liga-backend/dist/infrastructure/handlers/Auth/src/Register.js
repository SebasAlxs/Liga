"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const RegisterUseCase_1 = require("../../../../application/use-cases/Auth/RegisterUseCase");
const PrismaUserRepository_1 = require("../../../db/prisma/repositories/PrismaUserRepository");
const api_gateway_1 = require("../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaUserRepository_1.PrismaUserRepository();
        const useCase = new RegisterUseCase_1.RegisterUseCase(repo);
        const user = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, user, 201, "Usuario registrado exitosamente.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
