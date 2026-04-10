"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetAllCategoriesUseCase_1 = require("../../../../../application/use-cases/Category/GetAllCategoriesUseCase");
const PrismaCategoryRepository_1 = require("../../../../db/prisma/repositories/PrismaCategoryRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
        const useCase = new GetAllCategoriesUseCase_1.GetAllCategoriesUseCase(repo);
        const categories = await useCase.execute();
        return (0, api_gateway_1.successResponse)(res, categories, 200, "Categorías recuperadas con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
