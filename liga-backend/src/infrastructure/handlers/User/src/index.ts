import { handler as createUser } from "./CRUD/CreateUser";
import { handler as getAllUsers } from "./CRUD/GetAllUsers";
import { handler as updateUser } from "./CRUD/UpdateUser";
import { handler as deleteUser } from "./CRUD/DeleteUser";

export const UserHandlers = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
};
