import crypto from "crypto";
import { CategoryResponse, CreateCategoryRequest } from "../../../adapters/http/dto/CategoryResponse";
import { Category } from "../../../domain/entities/Category";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";

export class CreateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute(request: CreateCategoryRequest): Promise<CategoryResponse> {
        const category = new Category(
            crypto.randomUUID(),
            request.name
        );

        const created = await this.categoryRepository.save(category);

        return {
            _id: created.id,
            name: created.name,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
