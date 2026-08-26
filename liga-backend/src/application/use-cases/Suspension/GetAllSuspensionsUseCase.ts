import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { SuspensionResponse } from "../../../adapters/http/dto/SuspensionResponse";

export class GetAllSuspensionsUseCase {
    constructor(
        private suspensionRepository: SuspensionRepository,
        private playerRepository: PlayerRepository,
        private teamRepository: TeamRepository
    ) {}

    async execute(): Promise<SuspensionResponse[]> {
        const suspensions = await this.suspensionRepository.findAll();

        return Promise.all(suspensions.map(async (s) => {
            const [player, team] = await Promise.all([
                this.playerRepository.findById(s.playerId),
                s.teamId ? this.teamRepository.findById(s.teamId) : Promise.resolve(null)
            ]);

            return {
                id: s.id,
                playerId: s.playerId,
                playerName: player ? `${player.firstName} ${player.lastName}` : "Jugador desconocido",
                playerNumber: player?.number,
                teamId: s.teamId,
                teamName: team?.name,
                tournamentId: s.tournamentId,
                matchId: s.matchId,
                reason: s.reason,
                matchesSuspended: s.matchesSuspended,
                servedMatches: s.servedMatches,
                status: s.status,
                createdAt: s.createdAt?.toISOString(),
                updatedAt: s.updatedAt?.toISOString()
            };
        }));
    }
}
