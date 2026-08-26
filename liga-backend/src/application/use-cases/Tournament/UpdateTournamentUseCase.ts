import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { TournamentResponse, UpdateTournamentRequest } from "../../../adapters/http/dto/TournamentResponse";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";

export class UpdateTournamentUseCase {
    constructor(private tournamentRepository: TournamentRepository) { }

    async execute(id: string, request: UpdateTournamentRequest): Promise<TournamentResponse> {
        const existingTournament = await this.tournamentRepository.findById(id);
        if (!existingTournament) {
            throw new NotFoundError("Tournament not found");
        }

        if (request.name !== undefined) existingTournament.name = request.name;
        if (request.headquartersId !== undefined) existingTournament.headquartersId = request.headquartersId;
        if (request.maxYellowCardsForSuspension !== undefined) existingTournament.maxYellowCardsForSuspension = request.maxYellowCardsForSuspension;
        if (request.active !== undefined) existingTournament.active = request.active;
        if (request.blockPlayerWithPendingFines !== undefined) existingTournament.blockPlayerWithPendingFines = request.blockPlayerWithPendingFines;
        if (request.maxForeignPlayersOnField !== undefined) existingTournament.maxForeignPlayersOnField = request.maxForeignPlayersOnField;
        if (request.maxPlayersOnField !== undefined) existingTournament.maxPlayersOnField = request.maxPlayersOnField;
        if (request.minPlayersToStartMatch !== undefined) existingTournament.minPlayersToStartMatch = request.minPlayersToStartMatch;
        if (request.matchHalfDurationMinutes !== undefined) existingTournament.matchHalfDurationMinutes = request.matchHalfDurationMinutes;

        const updated = await this.tournamentRepository.update(existingTournament);

        return {
            _id: updated.id,
            name: updated.name,
            headquartersId: updated.headquartersId,
            maxYellowCardsForSuspension: updated.maxYellowCardsForSuspension,
            active: updated.active,
            blockPlayerWithPendingFines: updated.blockPlayerWithPendingFines,
            maxForeignPlayersOnField: updated.maxForeignPlayersOnField,
            maxPlayersOnField: updated.maxPlayersOnField,
            minPlayersToStartMatch: updated.minPlayersToStartMatch,
            matchHalfDurationMinutes: updated.matchHalfDurationMinutes,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
