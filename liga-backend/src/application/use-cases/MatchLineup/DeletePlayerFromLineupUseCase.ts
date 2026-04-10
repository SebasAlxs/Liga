import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";

export class DeletePlayerFromLineupUseCase {
    constructor(private lineupRepository: MatchLineupRepository) { }

    async execute(lineupId: string): Promise<void> {
        await this.lineupRepository.delete(lineupId);
    }
}
