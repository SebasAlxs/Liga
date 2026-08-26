
import { Stage } from "../../../domain/entities/Stage";
import { StageRepository } from "../../../domain/repositories/StageRepository";
export class GetTournamentStagesUseCase {
    constructor(private repository: StageRepository) {}
    async execute(tournamentId: string): Promise<Stage[]> {
        return this.repository.findByTournament(tournamentId);
    }
}
