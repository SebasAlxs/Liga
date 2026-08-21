import { ModuleAccess } from "../entities/ModuleAccess";

export interface ModuleAccessUpsertInput {
    role: string;
    module: string;
    visible: boolean;
}

export interface ModuleAccessRepository {
    findAll(): Promise<ModuleAccess[]>;
    findByRole(role: string): Promise<ModuleAccess[]>;
    upsertMany(items: ModuleAccessUpsertInput[]): Promise<ModuleAccess[]>;
}
