import { FixturePdfResponse } from "../../../adapters/http/dto/FixturePdfResponse";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { DomainError } from "../../../domain/exceptions/DomainError";

export class GetFixturePdfDataUseCase {
    constructor(
        private matchRepository: MatchRepository,
        private teamRepository: TeamRepository,
        private tournamentRepository: TournamentRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute(tournamentId: string, categoryId: string, stageId?: string): Promise<FixturePdfResponse> {
        const [tournament, category, matches, { items: teams }] = await Promise.all([
            this.tournamentRepository.findById(tournamentId),
            this.categoryRepository.findById(categoryId),
            this.matchRepository.findByTournamentAndCategory(tournamentId, categoryId, stageId),
            this.teamRepository.findAll(undefined, { tournamentId, categoryId })
        ]);

        if (!tournament) {
            throw new DomainError("Torneo no encontrado.");
        }
        if (!category) {
            throw new DomainError("Categoría no encontrada.");
        }
        if (matches.length === 0) {
            throw new DomainError("No existe un fixture generado para este torneo y categoría.");
        }

        const teamNameById = new Map(teams.map((t) => [t.id, t.name]));

        const roundsMap = new Map<number, { homeTeam: string; awayTeam: string }[]>();
        for (const match of matches) {
            const round = match.round ?? 0;
            const list = roundsMap.get(round) ?? [];
            list.push({
                homeTeam: teamNameById.get(match.homeTeamId) ?? "Equipo desconocido",
                awayTeam: teamNameById.get(match.awayTeamId) ?? "Equipo desconocido"
            });
            roundsMap.set(round, list);
        }

        const rounds = Array.from(roundsMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([round, matches]) => ({ round, matches }));

        return {
            tournamentId,
            categoryId,
            tournamentName: tournament.name,
            categoryName: category.name,
            rounds,
            generatedAt: new Date().toISOString()
        };
    }
}
