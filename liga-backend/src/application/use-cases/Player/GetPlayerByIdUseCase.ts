import { PlayerResponse } from "../../../adapters/http/dto/PlayerResponse";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { MatchEventRepository } from "../../../domain/repositories/MatchEventRepository";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";

export class GetPlayerByIdUseCase {
    constructor(
        private playerRepository: PlayerRepository,
        private eventRepository: MatchEventRepository,
        private lineupRepository: MatchLineupRepository
    ) { }

    async execute(id: string): Promise<PlayerResponse | null> {
        const player = await this.playerRepository.findById(id);
        if (!player) return null;

        const [eventStats, matchesPlayed] = await Promise.all([
            this.eventRepository.getPlayerStats(id),
            this.lineupRepository.countByPlayer(id),
        ]);
        const stats = { ...eventStats, matchesPlayed };

        return {
            _id: player.id,
            firstName: player.firstName,
            lastName: player.lastName,
            number: player.number,
            teamId: player.teamId,
            dni: player.dni,
            birthDate: player.birthDate?.toISOString(),
            isLocal: player.isLocal,
            picture: player.picture ? Buffer.from(player.picture).toString('base64') : undefined,
            stats,
            createdAt: player.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: player.updatedAt?.toISOString() || new Date().toISOString()
        };
    }
}
