"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const CreateCategoryUseCase_1 = require("../../../../../application/use-cases/Category/CreateCategoryUseCase");
const PrismaCategoryRepository_1 = require("../../../../db/prisma/repositories/PrismaCategoryRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
        const useCase = new CreateCategoryUseCase_1.CreateCategoryUseCase(repo);
        const category = await useCase.execute(req.body);
        return (0, api_gateway_1.successResponse)(res, category, 201, "Categoría creada con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
