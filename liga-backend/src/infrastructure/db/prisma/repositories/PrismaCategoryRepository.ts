import prisma from "../PrismaClient";
import { Category } from "../../../../domain/entities/Category";
import { CategoryRepository } from "../../../../domain/repositories/CategoryRepository";

export class PrismaCategoryRepository implements CategoryRepository {
    private prisma = prisma;
    constructor() { }

    async findAll(): Promise<Category[]> {
        const prismaCategories = await this.prisma.category.findMany({
            orderBy: { name: "asc" },
        });
        return prismaCategories.map(
            (c) => new Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt)
        );
    }

    async findById(id: string): Promise<Category | null> {
        const c = await this.prisma.category.findUnique({ where: { id } });
        if (!c) return null;
        return new Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt);
    }

    async save(category: Category): Promise<Category> {
        const c = await this.prisma.category.upsert({
            where: { id: category.id },
            update: {
                name: category.name,
                minAge: category.minAge,
                maxAge: category.maxAge,
            },
            create: {
                id: category.id,
                name: category.name,
                minAge: category.minAge,
                maxAge: category.maxAge,
            },
        });
        return new Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt);
    }

    async update(category: Category): Promise<Category> {
        const c = await this.prisma.category.update({
            where: { id: category.id },
            data: {
                name: category.name,
                minAge: category.minAge,
                maxAge: category.maxAge,
            },
        });
        return new Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.delete({ where: { id } });
    }
}
