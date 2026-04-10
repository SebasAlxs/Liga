"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor(id, name, minAge, maxAge, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }
    validate() {
        if (!this.name || this.name.length < 2) {
            throw new Error("Category name must be at least 2 characters long");
        }
    }
}
exports.Category = Category;
