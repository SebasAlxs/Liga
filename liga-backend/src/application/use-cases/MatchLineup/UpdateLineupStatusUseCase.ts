import { MatchLineup, LineupStatus } from "../../../domain/entities/MatchLineup";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";

export class UpdateLineupStatusUseCase {
    constructor(private lineupRepository: MatchLineupRepository) { }

    async execute(lineupId: string, status: LineupStatus): Promise<MatchLineup> {
        const item = await this.lineupRepository.findById(lineupId);
        if (!item) {
            throw new Error("Registro de nómina no encontrado.");
        }

        item.status = status;
        return await this.lineupRepository.update(item);
    }
}
