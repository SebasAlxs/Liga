"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DeleteCategoryUseCase_1 = require("../../../../../application/use-cases/Category/DeleteCategoryUseCase");
const PrismaCategoryRepository_1 = require("../../../../db/prisma/repositories/PrismaCategoryRepository");
const api_gateway_1 = require("../../../../libs/api-gateway");
const handler = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = new PrismaCategoryRepository_1.PrismaCategoryRepository();
        const useCase = new DeleteCategoryUseCase_1.DeleteCategoryUseCase(repo);
        await useCase.execute(id);
        return (0, api_gateway_1.successResponse)(res, null, 200, "Categoría eliminada con éxito.");
    }
    catch (error) {
        return (0, api_gateway_1.errorResponse)(res, error.message);
    }
};
exports.handler = handler;
