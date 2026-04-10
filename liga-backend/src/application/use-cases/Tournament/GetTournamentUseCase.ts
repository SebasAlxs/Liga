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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
