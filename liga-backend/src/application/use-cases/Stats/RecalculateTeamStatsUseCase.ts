import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";

export class RecalculateTeamStatsUseCase {
    constructor(
        private teamRepository: TeamRepository,
        private matchRepository: MatchRepository
    ) { }

    async execute(teamId: string): Promise<void> {
        const team = await this.teamRepository.findById(teamId);
        if (!team) return;

        // Reset all metrics to 0
        team.points = 0;
        team.matchesPlayed = 0;
        team.matchesWon = 0;
        team.matchesDrawn = 0;
        team.matchesLost = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
        team.goalDifference = 0;

        const myMatches = await this.matchRepository.findFinishedByTeam(teamId);

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
            } else if (goalsFor < goalsAgainst) {
                team.matchesLost++;
            } else {
                team.matchesDrawn++;
                team.points += 1;
            }
        }

        team.goalDifference = team.goalsFor - team.goalsAgainst;

        await this.teamRepository.update(team);
    }
}
