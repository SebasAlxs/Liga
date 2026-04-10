"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryUseCase = void 0;
class UpdateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(id, request) {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        if (request.name !== undefined)
            existingCategory.name = request.name;
        const updated = await this.categoryRepository.update(existingCategory);
        return {
            _id: updated.id,
            name: updated.name,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
exports.UpdateCategoryUseCase = UpdateCategoryUseCase;
