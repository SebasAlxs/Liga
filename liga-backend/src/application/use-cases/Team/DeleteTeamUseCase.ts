import { DomainError } from "../../../domain/exceptions/DomainError";
import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export class DeleteTeamUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(id: string, user?: { id: string, role: string }): Promise<void> {
        const existingTeam = await this.teamRepository.findById(id);
        if (!existingTeam) {
            throw new NotFoundError("Team not found");
        }

        if (user) {
            if (user.role !== 'SUPERADMIN') {
                throw new DomainError("Solo el SUPERADMIN puede eliminar equipos.");
            }
        }

        await this.teamRepository.delete(id);
    }
}
