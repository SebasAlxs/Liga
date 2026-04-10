"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMatchUseCase = void 0;
class UpdateMatchUseCase {
    constructor(matchRepository, teamStatsUseCase) {
        this.matchRepository = matchRepository;
        this.teamStatsUseCase = teamStatsUseCase;
    }
    async execute(id, request) {
        const existingMatch = await this.matchRepository.findById(id);
        if (!existingMatch) {
            throw new Error("Match not found");
        }
        if (request.homeTeamId)
            existingMatch.homeTeamId = request.homeTeamId;
        if (request.awayTeamId)
            existingMatch.awayTeamId = request.awayTeamId;
        if (request.homeScore !== undefined)
            existingMatch.homeScore = request.homeScore;
        if (request.awayScore !== undefined)
            existingMatch.awayScore = request.awayScore;
        if (request.matchDate)
            existingMatch.matchDate = new Date(request.matchDate);
        if (request.tournamentId)
            existingMatch.tournamentId = request.tournamentId;
        if (request.categoryId)
            existingMatch.categoryId = request.categoryId;
        if (request.status)
            existingMatch.status = request.status;
        const updated = await this.matchRepository.update(existingMatch);
        if (updated.status === "FINISHED") {
            await this.teamStatsUseCase.execute(updated.homeTeamId);
            await this.teamStatsUseCase.execute(updated.awayTeamId);
        }
        return {
            _id: updated.id,
            homeTeamId: updated.homeTeamId,
            awayTeamId: updated.awayTeamId,
            homeScore: updated.homeScore,
            awayScore: updated.awayScore,
            matchDate: updated.matchDate.toISOString(),
            tournamentId: updated.tournamentId,
            categoryId: updated.categoryId,
            status: updated.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
}
exports.UpdateMatchUseCase = UpdateMatchUseCase;
