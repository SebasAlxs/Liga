"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoryUseCase = void 0;
class GetCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            return null;
        }
        return {
            _id: category.id,
            name: category.name,
            minAge: category.minAge,
            maxAge: category.maxAge,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }
}
exports.GetCategoryUseCase = GetCategoryUseCase;
