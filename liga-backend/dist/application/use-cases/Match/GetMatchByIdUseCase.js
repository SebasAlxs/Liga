"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchByIdUseCase = void 0;
class GetMatchByIdUseCase {
    constructor(matchRepository) {
        this.matchRepository = matchRepository;
    }
    async execute(id) {
        const match = await this.matchRepository.findById(id);
        if (!match)
            return null;
        return {
            _id: match.id,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            matchDate: match.matchDate.toISOString(),
            tournamentId: match.tournamentId,
            categoryId: match.categoryId,
            status: match.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
}
exports.GetMatchByIdUseCase = GetMatchByIdUseCase;
