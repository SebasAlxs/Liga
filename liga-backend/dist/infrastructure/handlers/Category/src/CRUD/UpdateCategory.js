"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UpdateCategoryUseCase_1 = require("../../../../../application/use-cases/Category/UpdateCategoryUseCase");
const PrismaCategoryRepository_1 = require("../../../../db/prisma/repositories/PrismaCategoryRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
        const useCase = new UpdateCategoryUseCase_1.UpdateCategoryUseCase(repo);
        const category = await useCase.execute(id, req.body);
        return (0, api_gateway_1.successResponse)(res, category, 200, "Categoría actualizada con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
