"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecalculateTeamStatsUseCase = void 0;
const Match_1 = require("../../../domain/entities/Match");
class RecalculateTeamStatsUseCase {
    constructor(teamRepository, matchRepository) {
        this.teamRepository = teamRepository;
        this.matchRepository = matchRepository;
    }
    async execute(teamId) {
        const team = await this.teamRepository.findById(teamId);
        if (!team)
            return;
        // Reset all metrics to 0
        team.points = 0;
        team.matchesPlayed = 0;
        team.matchesWon = 0;
        team.matchesDrawn = 0;
        team.matchesLost = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
        team.goalDifference = 0;
        // Fetch all Matches for this team (needs all matches, then we manually filter or we could add a repository method to get team matches)
        // For simplicity, fetch all and filter, or create a specific method. Let's fetch all (since it's a Proof of Concept).
        // A better approach would be to update the MatchRepository to search by TeamId. 
        // We will fetch all here and filter.
        const allMatches = await this.matchRepository.findAll();
        const myMatches = allMatches.filter(m => (m.homeTeamId === teamId || m.awayTeamId === teamId) && m.status === Match_1.MatchStatus.FINISHED);
        for (const match of myMatches) {
            team.matchesPlayed++;
            const isHome = match.homeTeamId === teamId;
            const goalsFor = isHome ? (match.homeScore || 0) : (match.awayScore || 0);
            const goalsAgainst = isHome ? (match.awayScore || 0) : (match.homeScore || 0);
            team.goalsFor += goalsFor;
            team.goalsAgainst += goalsAgainst;
            if (goalsFor > goalsAgainst) {
                team.matchesWon++;
                team.points += 3;
            }
            else if (goalsFor < goalsAgainst) {
                team.matchesLost++;
            }
            else {
                team.matchesDrawn++;
                team.points += 1;
            }
        }
        team.goalDifference = team.goalsFor - team.goalsAgainst;
        await this.teamRepository.update(team);
    }
}
exports.RecalculateTeamStatsUseCase = RecalculateTeamStatsUseCase;
