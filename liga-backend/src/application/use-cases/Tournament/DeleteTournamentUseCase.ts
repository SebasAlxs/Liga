import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";

export class DeleteTournamentUseCase {
    constructor(private tournamentRepository: TournamentRepository) { }

    async execute(id: string): Promise<void> {
        const existingTournament = await this.tournamentRepository.findById(id);
        if (!existingTournament) {
            throw new Error("Tournament not found");
        }

        // Additional validation could be added here (e.g., checking for related matches)
        await this.tournamentRepository.delete(id);
    }
}
