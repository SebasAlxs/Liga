import { TournamentResponse } from "../../../adapters/http/dto/TournamentResponse";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";

export class GetTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(id: string): Promise<TournamentResponse | null> {
    const tournament = await this.tournamentRepository.findById(id);
    if (!tournament) {
      return null;
    }
    return {
      _id: tournament.id,
      name: tournament.name,
      active: tournament.active,
      maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
      headquartersId: tournament.headquartersId,
      blockPlayerWithPendingFines: tournament.blockPlayerWithPendingFines,
      maxForeignPlayersOnField: tournament.maxForeignPlayersOnField,
      maxPlayersOnField: tournament.maxPlayersOnField,
      minPlayersToStartMatch: tournament.minPlayersToStartMatch,
      matchHalfDurationMinutes: tournament.matchHalfDurationMinutes,
      createdAt: tournament.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: tournament.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
