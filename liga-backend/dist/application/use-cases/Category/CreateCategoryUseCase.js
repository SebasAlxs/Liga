"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoryUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Category_1 = require("../../../domain/entities/Category");
class CreateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(request) {
        const category = new Category_1.Category(crypto_1.default.randomUUID(), request.name);
        const created = await this.categoryRepository.save(category);
        return {
            _id: created.id,
            name: created.name,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
exports.CreateCategoryUseCase = CreateCategoryUseCase;
