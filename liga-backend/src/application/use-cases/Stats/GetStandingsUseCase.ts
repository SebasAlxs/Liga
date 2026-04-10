import { TeamResponse } from "../../../adapters/http/dto/TeamResponse";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export class GetStandingsUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(tournamentId: string): Promise<TeamResponse[]> {
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
