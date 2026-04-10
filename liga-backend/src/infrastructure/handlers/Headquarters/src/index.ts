import { handler as createHeadquarters } from "./CRUD/CreateHeadquarters";
import { handler as getAllHeadquarters } from "./CRUD/GetHeadquarters";
import { handler as updateHeadquarters } from "./CRUD/UpdateHeadquarters";
import { handler as deleteHeadquarters } from "./CRUD/DeleteHeadquarters";

export const HeadquartersHandlers = {
    createHeadquarters,
    getAllHeadquarters,
    updateHeadquarters,
    deleteHeadquarters,
};
