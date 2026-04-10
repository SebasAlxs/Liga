"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentUseCase = void 0;
class GetTournamentUseCase {
    constructor(tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }
    async execute(id) {
        const tournament = await this.tournamentRepository.findById(id);
        if (!tournament) {
            return null;
        }
        return {
            _id: tournament.id,
            name: tournament.name,
            active: tournament.active,
            maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
            headquartersId: tournament.headquartersId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }
}
exports.GetTournamentUseCase = GetTournamentUseCase;
