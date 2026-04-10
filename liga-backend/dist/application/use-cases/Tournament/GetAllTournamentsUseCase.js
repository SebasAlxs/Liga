"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllTournamentsUseCase = void 0;
class GetAllTournamentsUseCase {
    constructor(tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }
    async execute() {
        const tournaments = await this.tournamentRepository.findAll();
        return tournaments.map((t) => ({
            _id: t.id,
            name: t.name,
            headquartersId: t.headquartersId,
            maxYellowCardsForSuspension: t.maxYellowCardsForSuspension,
            active: t.active,
            createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
        }));
    }
}
exports.GetAllTournamentsUseCase = GetAllTournamentsUseCase;
