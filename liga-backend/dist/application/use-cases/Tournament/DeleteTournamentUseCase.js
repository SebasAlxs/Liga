"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTournamentUseCase = void 0;
class DeleteTournamentUseCase {
    constructor(tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }
    async execute(id) {
        const existingTournament = await this.tournamentRepository.findById(id);
        if (!existingTournament) {
            throw new Error("Tournament not found");
        }
        // Additional validation could be added here (e.g., checking for related matches)
        await this.tournamentRepository.delete(id);
    }
}
exports.DeleteTournamentUseCase = DeleteTournamentUseCase;
