import { handler as getAllModuleAccess } from "./CRUD/GetAllModuleAccess";
import { handler as updateModuleAccess } from "./CRUD/UpdateModuleAccess";
import { handler as getMyModules } from "./CRUD/GetMyModules";

export const ModuleAccessHandlers = {
    getAllModuleAccess,
    updateModuleAccess,
    getMyModules,
};
