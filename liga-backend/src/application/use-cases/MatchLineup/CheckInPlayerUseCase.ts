import { MatchLineup } from "../../../domain/entities/MatchLineup";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";

export class CheckInPlayerUseCase {
    constructor(private lineupRepository: MatchLineupRepository) { }

    async execute(lineupId: string, checkedIn: boolean): Promise<MatchLineup> {
        const item = await this.lineupRepository.findById(lineupId);
        if (!item) {
            throw new Error("Registro de nómina no encontrado.");
        }

        item.checkedIn = checkedIn;
        return await this.lineupRepository.update(item);
    }
}
