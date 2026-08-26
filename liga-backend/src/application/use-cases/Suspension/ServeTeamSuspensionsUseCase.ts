import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";

export class ServeTeamSuspensionsUseCase {
    constructor(
        private suspensionRepository: SuspensionRepository,
        private matchLineupRepository: MatchLineupRepository
    ) { }

    async execute(teamId: string, tournamentId: string, finishedMatchId: string, finishedMatchDate: Date): Promise<void> {
        const activeSuspensions = await this.suspensionRepository.findActiveByTeamAndTournament(teamId, tournamentId);

        for (const suspension of activeSuspensions) {
            const issuedInThisMatch = suspension.matchId === finishedMatchId;
            const issuedBeforeThisMatch = !!suspension.createdAt && suspension.createdAt <= finishedMatchDate;

            if (!issuedInThisMatch && issuedBeforeThisMatch) {
                // Verificar que el jugador NO haya jugado en este partido
                const playedInMatch = await this.matchLineupRepository.findByMatchAndPlayer(finishedMatchId, suspension.playerId);

                if (!playedInMatch) {
                    suspension.servedMatches += 1;
                    
                    if (suspension.servedMatches >= suspension.matchesSuspended) {
                        suspension.status = "SERVED";
                    }
                    
                    await this.suspensionRepository.update(suspension);
                }
            }
        }
    }
}
