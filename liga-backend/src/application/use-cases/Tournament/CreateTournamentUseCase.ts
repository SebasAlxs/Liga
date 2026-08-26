import crypto from "crypto";
import { TournamentResponse, CreateTournamentRequest } from "../../../adapters/http/dto/TournamentResponse";
import { Tournament } from "../../../domain/entities/Tournament";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";

export class CreateTournamentUseCase {
    constructor(private tournamentRepository: TournamentRepository) { }

    async execute(request: CreateTournamentRequest): Promise<TournamentResponse> {
        const tournament = new Tournament(
            crypto.randomUUID(),
            request.name,
            request.maxYellowCardsForSuspension ?? 3,
            request.active ?? true,
            request.blockPlayerWithPendingFines ?? false,
            request.maxForeignPlayersOnField ?? 4,
            request.maxPlayersOnField ?? 11,
            request.minPlayersToStartMatch ?? 7,
            request.matchHalfDurationMinutes ?? 45,
            undefined,
            undefined,
            request.headquartersId
        );

        const created = await this.tournamentRepository.save(tournament);

        return {
            _id: created.id,
            name: created.name,
            headquartersId: created.headquartersId,
            maxYellowCardsForSuspension: created.maxYellowCardsForSuspension,
            active: created.active,
            blockPlayerWithPendingFines: created.blockPlayerWithPendingFines,
            maxForeignPlayersOnField: created.maxForeignPlayersOnField,
            maxPlayersOnField: created.maxPlayersOnField,
            minPlayersToStartMatch: created.minPlayersToStartMatch,
            matchHalfDurationMinutes: created.matchHalfDurationMinutes,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
