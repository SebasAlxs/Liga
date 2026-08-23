import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";

export class DeleteCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute(id: string): Promise<void> {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new NotFoundError("Category not found");
        }

        // Additional validation could be added here (e.g., checking for related teams/matches)
        await this.categoryRepository.delete(id);
    }
}
