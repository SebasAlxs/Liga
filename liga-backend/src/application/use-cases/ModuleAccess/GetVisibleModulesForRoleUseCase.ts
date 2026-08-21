import { ModuleAccessRepository } from "../../../domain/repositories/ModuleAccessRepository";

export class GetVisibleModulesForRoleUseCase {
    constructor(private moduleAccessRepository: ModuleAccessRepository) { }

    async execute(role: string): Promise<string[]> {
        const rows = await this.moduleAccessRepository.findByRole(role);
        return rows.filter((r) => r.visible).map((r) => r.module);
    }
}
