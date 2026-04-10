"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCategoryRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const Category_1 = require("../../../../domain/entities/Category");
class PrismaCategoryRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async findAll() {
        const prismaCategories = await this.prisma.category.findMany({
            orderBy: { name: "asc" },
        });
        return prismaCategories.map((c) => new Category_1.Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt));
    }
    async findById(id) {
        const c = await this.prisma.category.findUnique({ where: { id } });
        if (!c)
            return null;
        return new Category_1.Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt);
    }
    async save(category) {
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
        return new Category_1.Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt);
    }
    async update(category) {
        const c = await this.prisma.category.update({
            where: { id: category.id },
            data: {
                name: category.name,
                minAge: category.minAge,
                maxAge: category.maxAge,
            },
        });
        return new Category_1.Category(c.id, c.name, c.minAge ?? undefined, c.maxAge ?? undefined, c.createdAt, c.updatedAt);
    }
    async delete(id) {
        await this.prisma.category.delete({ where: { id } });
    }
}
exports.PrismaCategoryRepository = PrismaCategoryRepository;
