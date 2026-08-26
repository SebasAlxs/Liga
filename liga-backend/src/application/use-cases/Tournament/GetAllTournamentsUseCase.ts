import { TournamentResponse } from "../../../adapters/http/dto/TournamentResponse";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";

export class GetAllTournamentsUseCase {
    constructor(private tournamentRepository: TournamentRepository) { }

    async execute(): Promise<TournamentResponse[]> {
        const tournaments = await this.tournamentRepository.findAll();
        return tournaments.map((t) => ({
            _id: t.id,
            name: t.name,
            headquartersId: t.headquartersId,
            maxYellowCardsForSuspension: t.maxYellowCardsForSuspension,
            active: t.active,
            blockPlayerWithPendingFines: t.blockPlayerWithPendingFines,
            maxForeignPlayersOnField: t.maxForeignPlayersOnField,
            maxPlayersOnField: t.maxPlayersOnField,
            minPlayersToStartMatch: t.minPlayersToStartMatch,
            matchHalfDurationMinutes: t.matchHalfDurationMinutes,
            createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
        }));
    }
}
