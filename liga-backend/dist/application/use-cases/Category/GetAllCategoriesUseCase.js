"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllCategoriesUseCase = void 0;
class GetAllCategoriesUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute() {
        const categories = await this.categoryRepository.findAll();
        return categories.map((c) => ({
            _id: c.id,
            name: c.name,
            createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
        }));
    }
}
exports.GetAllCategoriesUseCase = GetAllCategoriesUseCase;
