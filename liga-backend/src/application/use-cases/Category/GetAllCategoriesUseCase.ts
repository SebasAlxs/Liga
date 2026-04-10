import { CategoryResponse } from "../../../adapters/http/dto/CategoryResponse";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";

export class GetAllCategoriesUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute(): Promise<CategoryResponse[]> {
        const categories = await this.categoryRepository.findAll();
        return categories.map((c) => ({
            _id: c.id,
            name: c.name,
            createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
        }));
    }
}
