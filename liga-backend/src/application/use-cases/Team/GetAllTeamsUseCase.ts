import { TeamResponse } from "../../../adapters/http/dto/TeamResponse";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export class GetAllTeamsUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(): Promise<TeamResponse[]> {
        const teams = await this.teamRepository.findAll();
        return teams.map(
            (t) => ({
                _id: t.id,
                name: t.name,
                logo: t.logo,
                foundedYear: t.foundedYear,
                championshipsWon: t.championshipsWon ?? null,
                categoryId: t.categoryId,
                tournamentId: t.tournamentId,
                points: t.points,
                matchesPlayed: t.matchesPlayed,
                matchesWon: t.matchesWon,
                matchesDrawn: t.matchesDrawn,
                matchesLost: t.matchesLost,
                goalsFor: t.goalsFor,
                goalsAgainst: t.goalsAgainst,
                goalDifference: t.goalDifference,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        );
    }
}
