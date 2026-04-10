import { MatchLineup } from "../../../domain/entities/MatchLineup";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";

export class GetMatchLineupUseCase {
    constructor(private lineupRepository: MatchLineupRepository) { }

    async execute(matchId: string): Promise<MatchLineup[]> {
        return await this.lineupRepository.findByMatch(matchId);
    }
}
