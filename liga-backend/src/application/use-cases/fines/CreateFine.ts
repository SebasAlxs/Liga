import crypto from 'crypto';
import { FineRepository } from '../../../domain/repositories/FineRepository';
import { SuspensionRepository } from '../../../domain/repositories/SuspensionRepository';
import { TeamRepository } from '../../../domain/repositories/TeamRepository';
import { MatchRepository } from '../../../domain/repositories/MatchRepository';
import { TournamentRepository } from '../../../domain/repositories/TournamentRepository';
import { Fine } from '../../../domain/entities/Fine';
import { Suspension } from '../../../domain/entities/Suspension';

export class CreateFine {
  constructor(
    private fineRepository: FineRepository,
    private suspensionRepository: SuspensionRepository,
    private teamRepository: TeamRepository,
    private matchRepository: MatchRepository,
    private tournamentRepository: TournamentRepository
  ) {}

  async execute(data: Omit<Fine, 'id' | 'createdAt' | 'updatedAt'>) {
    const fine = await this.fineRepository.create(data);

    if (fine.playerId) {
      await this.applySanctionIfNeeded(fine);
    }

    return fine;
  }

  private async applySanctionIfNeeded(fine: Fine) {
    const tournamentId = await this.resolveTournamentId(fine);
    if (!tournamentId) return;

    const reason = (fine.reason || '').trim().toLowerCase();

    if (reason === 'roja directa') {
      await this.suspensionRepository.create(new Suspension(
        crypto.randomUUID(),
        fine.playerId as string,
        tournamentId,
        'Roja Directa',
        1,
        'ACTIVE',
        fine.matchId ?? undefined,
        undefined,
        undefined,
        fine.teamId,
        fine.id
      ));
      return;
    }

    if (reason === 'tarjeta amarilla') {
      const tournament = await this.tournamentRepository.findById(tournamentId);
      const limit = tournament?.maxYellowCardsForSuspension;
      if (!limit) return;

      const count = await this.fineRepository.countByPlayerReasonAndTournament(fine.playerId as string, fine.reason, tournamentId);
      if (count > 0 && count % limit === 0) {
        await this.suspensionRepository.create(new Suspension(
          crypto.randomUUID(),
          fine.playerId as string,
          tournamentId,
          `Acumulación de ${limit} Tarjetas Amarillas`,
          1,
          'ACTIVE',
          fine.matchId ?? undefined,
          undefined,
          undefined,
          fine.teamId,
          fine.id
        ));
      }
    }
  }

  private async resolveTournamentId(fine: Fine): Promise<string | undefined> {
    if (fine.matchId) {
      const match = await this.matchRepository.findById(fine.matchId);
      if (match?.tournamentId) return match.tournamentId;
    }
    const team = await this.teamRepository.findById(fine.teamId);
    return team?.tournamentId ?? undefined;
  }
}
