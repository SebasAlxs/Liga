"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryHandlers = void 0;
const CreateCategory_1 = require("./CRUD/CreateCategory");
const GetAllCategories_1 = require("./CRUD/GetAllCategories");
const UpdateCategory_1 = require("./CRUD/UpdateCategory");
const DeleteCategory_1 = require("./CRUD/DeleteCategory");
const GetCategory_1 = require("./CRUD/GetCategory");
exports.CategoryHandlers = {
    createCategory: CreateCategory_1.handler,
    getAllCategories: GetAllCategories_1.handler,
    updateCategory: UpdateCategory_1.handler,
    deleteCategory: DeleteCategory_1.handler,
    getCategory: GetCategory_1.handler,
};
