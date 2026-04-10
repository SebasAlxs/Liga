import { Suspension } from "../../../domain/entities/Suspension";
import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";

export class GetPlayerSuspensionsUseCase {
    constructor(private suspensionRepository: SuspensionRepository) { }

    async execute(playerId: string, tournamentId: string): Promise<Suspension[]> {
        return await this.suspensionRepository.findByPlayerInTournament(playerId, tournamentId);
    }
}
