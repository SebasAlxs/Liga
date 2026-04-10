"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTournamentUseCase = void 0;
class UpdateTournamentUseCase {
    constructor(tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }
    async execute(id, request) {
        const existingTournament = await this.tournamentRepository.findById(id);
        if (!existingTournament) {
            throw new Error("Tournament not found");
        }
        if (request.name !== undefined)
            existingTournament.name = request.name;
        if (request.headquartersId !== undefined)
            existingTournament.headquartersId = request.headquartersId;
        if (request.maxYellowCardsForSuspension !== undefined)
            existingTournament.maxYellowCardsForSuspension = request.maxYellowCardsForSuspension;
        if (request.active !== undefined)
            existingTournament.active = request.active;
        const updated = await this.tournamentRepository.update(existingTournament);
        return {
            _id: updated.id,
            name: updated.name,
            headquartersId: updated.headquartersId,
            maxYellowCardsForSuspension: updated.maxYellowCardsForSuspension,
            active: updated.active,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
exports.UpdateTournamentUseCase = UpdateTournamentUseCase;
