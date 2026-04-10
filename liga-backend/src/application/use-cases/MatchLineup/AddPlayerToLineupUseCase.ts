import { MatchLineup, LineupStatus } from "../../../domain/entities/MatchLineup";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";
import { v4 as uuidv4 } from "uuid";

export interface AddPlayerToLineupRequest {
    matchId: string;
    playerId: string;
    teamId: string;
    status: LineupStatus;
    number?: number;
}

export class AddPlayerToLineupUseCase {
    constructor(private lineupRepository: MatchLineupRepository) { }

    async execute(request: AddPlayerToLineupRequest): Promise<MatchLineup> {
        // Check if player already in lineup
        const existing = await this.lineupRepository.findByMatchAndPlayer(request.matchId, request.playerId);
        if (existing) {
            throw new Error("El jugador ya está en la nómina de este partido.");
        }

        // Logic check: if status is STARTER, maybe count how many starters there are?
        // User said "agregar a los once en campo". 
        // We could enforce 11 max starters, but maybe keep it flexible and just warn in UI.
        // For now, let's keep it simple.

        const newLineup = new MatchLineup(
            uuidv4(),
            request.matchId,
            request.playerId,
            request.teamId,
            request.status,
            false, // default not checked-in
            request.number
        );

        return await this.lineupRepository.create(newLineup);
    }
}
