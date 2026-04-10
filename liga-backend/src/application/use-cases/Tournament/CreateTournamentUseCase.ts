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
            request.headquartersId,
            request.maxYellowCardsForSuspension ?? 3,
            request.active ?? true
        );

        const created = await this.tournamentRepository.save(tournament);

        return {
            _id: created.id,
            name: created.name,
            headquartersId: created.headquartersId,
            maxYellowCardsForSuspension: created.maxYellowCardsForSuspension,
            active: created.active,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
