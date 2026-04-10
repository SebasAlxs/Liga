"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const LoginUseCase_1 = require("../../../../application/use-cases/Auth/LoginUseCase");
const PrismaUserRepository_1 = require("../../../db/prisma/repositories/PrismaUserRepository");
const api_gateway_1 = require("../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaUserRepository_1.PrismaUserRepository();
        const useCase = new LoginUseCase_1.LoginUseCase(repo);
        const result = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, result, 200, "Inicio de sesión exitoso.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
