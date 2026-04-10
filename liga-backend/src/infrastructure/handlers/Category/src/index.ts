import { handler as createCategory } from "./CRUD/CreateCategory";
import { handler as getAllCategories } from "./CRUD/GetAllCategories";
import { handler as updateCategory } from "./CRUD/UpdateCategory";
import { handler as deleteCategory } from "./CRUD/DeleteCategory";
import { handler as getCategory } from "./CRUD/GetCategory";

export const CategoryHandlers = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategory,
};
