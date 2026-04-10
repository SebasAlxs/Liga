import { CategoryResponse, UpdateCategoryRequest } from "../../../adapters/http/dto/CategoryResponse";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute(id: string, request: UpdateCategoryRequest): Promise<CategoryResponse> {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error("Category not found");
        }

        if (request.name !== undefined) existingCategory.name = request.name;

        const updated = await this.categoryRepository.update(existingCategory);

        return {
            _id: updated.id,
            name: updated.name,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
