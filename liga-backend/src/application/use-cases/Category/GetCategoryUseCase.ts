import { CategoryResponse } from "../../../adapters/http/dto/CategoryResponse";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";

export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<CategoryResponse | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      return null;
    }
    return {
      _id: category.id,
      name: category.name,
      minAge: category.minAge,
      maxAge: category.maxAge,
      createdAt: category.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: category.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
