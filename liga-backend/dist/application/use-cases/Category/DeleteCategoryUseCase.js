"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCategoryUseCase = void 0;
class DeleteCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(id) {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        // Additional validation could be added here (e.g., checking for related teams/matches)
        await this.categoryRepository.delete(id);
    }
}
exports.DeleteCategoryUseCase = DeleteCategoryUseCase;
