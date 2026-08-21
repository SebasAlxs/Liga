import { ModuleAccessResponse } from "../../../adapters/http/dto/ModuleAccessResponse";
import { ModuleAccessRepository } from "../../../domain/repositories/ModuleAccessRepository";

export class GetAllModuleAccessUseCase {
    constructor(private moduleAccessRepository: ModuleAccessRepository) { }

    async execute(): Promise<ModuleAccessResponse[]> {
        const rows = await this.moduleAccessRepository.findAll();
        return rows.map((r) => ({
            _id: r.id,
            role: r.role,
            module: r.module,
            visible: r.visible,
        }));
    }
}
