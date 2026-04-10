"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const GetCategoryUseCase_1 = require("../../../../../application/use-cases/Category/GetCategoryUseCase");
const PrismaCategoryRepository_1 = require("../../../../db/prisma/repositories/PrismaCategoryRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
        const useCase = new GetCategoryUseCase_1.GetCategoryUseCase(repo);
        const category = await useCase.execute(req.params.id);
        if (!category) {
            return (0, api_gateway_1.errorResponse)(res, "Category not found", 404);
        }
        return (0, api_gateway_1.successResponse)(res, category, 200, "Categoría obtenida con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
