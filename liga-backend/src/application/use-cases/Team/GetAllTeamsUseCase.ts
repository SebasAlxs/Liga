import { TeamResponse } from "../../../adapters/http/dto/TeamResponse";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { PaginationParams } from "../../../domain/repositories/Pagination";

export class GetAllTeamsUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(pagination?: PaginationParams): Promise<{ items: TeamResponse[]; total: number }> {
        const { items: teams, total } = await this.teamRepository.findAll(pagination);
        const items = teams.map(
            (t) => ({
                id: t.id,
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
                createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: t.updatedAt?.toISOString() || new Date().toISOString()
            })
        );
        return { items, total };
    }
}
