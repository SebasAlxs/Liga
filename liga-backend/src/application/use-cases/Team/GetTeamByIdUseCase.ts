import { TeamResponse } from "../../../adapters/http/dto/TeamResponse";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export class GetTeamByIdUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(id: string): Promise<TeamResponse | null> {
        const team = await this.teamRepository.findById(id);
        if (!team) return null;
        return {
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
        };
    }
}
