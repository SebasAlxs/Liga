import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export class DeleteTeamUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(id: string): Promise<void> {
        const existingTeam = await this.teamRepository.findById(id);
        if (!existingTeam) {
            throw new Error("Team not found");
        }
        await this.teamRepository.delete(id);
    }
}
