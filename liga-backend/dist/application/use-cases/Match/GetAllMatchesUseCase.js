"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMatchesUseCase = void 0;
class GetAllMatchesUseCase {
    constructor(matchRepository) {
        this.matchRepository = matchRepository;
    }
    async execute() {
        const matches = await this.matchRepository.findAll();
        return matches.map(m => {
            return {
                _id: m.id,
                homeTeamId: m.homeTeamId,
                awayTeamId: m.awayTeamId,
                homeScore: m.homeScore,
                awayScore: m.awayScore,
                matchDate: m.matchDate.toISOString(),
                tournamentId: m.tournamentId,
                categoryId: m.categoryId,
                status: m.status,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        });
    }
}
exports.GetAllMatchesUseCase = GetAllMatchesUseCase;
