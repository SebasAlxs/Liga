"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStandingsUseCase = void 0;
class GetStandingsUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(tournamentId) {
        const teams = await this.teamRepository.getStandings(tournamentId);
        return teams.map((team) => ({
            _id: team.id,
            name: team.name,
            logo: team.logo,
            foundedYear: team.foundedYear,
            championshipsWon: team.championshipsWon ?? null,
            categoryId: team.categoryId,
            tournamentId: team.tournamentId,
            points: team.points,
            matchesPlayed: team.matchesPlayed,
            matchesWon: team.matchesWon,
            matchesDrawn: team.matchesDrawn,
            matchesLost: team.matchesLost,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDifference: team.goalDifference,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));
    }
}
exports.GetStandingsUseCase = GetStandingsUseCase;
