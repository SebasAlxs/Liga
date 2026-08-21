import { ModuleAccessResponse, UpdateModuleAccessRequest } from "../../../adapters/http/dto/ModuleAccessResponse";
import { ModuleAccessRepository } from "../../../domain/repositories/ModuleAccessRepository";

const VALID_ROLES = ["SUPERADMIN", "ADMIN", "VOCAL", "DIRIGENTE"];

export class UpdateModuleAccessUseCase {
    constructor(private moduleAccessRepository: ModuleAccessRepository) { }

    async execute(request: UpdateModuleAccessRequest): Promise<ModuleAccessResponse[]> {
        const items = request?.items || [];
        if (!items.length) {
            throw new Error("No se enviaron cambios para actualizar.");
        }
        for (const item of items) {
            if (!VALID_ROLES.includes(item.role)) {
                throw new Error(`Rol inválido: ${item.role}`);
            }
            if (!item.module || typeof item.module !== "string") {
                throw new Error("Módulo inválido.");
            }
        }

        const updated = await this.moduleAccessRepository.upsertMany(items);
        return updated.map((r) => ({
            _id: r.id,
            role: r.role,
            module: r.module,
            visible: r.visible,
        }));
    }
}
