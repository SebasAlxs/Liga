import { MatchLineup, LineupStatus } from "../../../domain/entities/MatchLineup";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";
import { v4 as uuidv4 } from "uuid";

export interface AddPlayerToLineupRequest {
    matchId: string;
    playerId: string;
    teamId: string;
    status: LineupStatus;
    number?: number;
    checkedIn?: boolean;
}

export class AddPlayerToLineupUseCase {
    constructor(private lineupRepository: MatchLineupRepository) { }

    async execute(request: AddPlayerToLineupRequest): Promise<MatchLineup> {
        // Check if player already in lineup
        const existing = await this.lineupRepository.findByMatchAndPlayer(request.matchId, request.playerId);
        
        if (existing) {
            // Update existing record instead of throwing
            existing.status = request.status;
            existing.checkedIn = request.checkedIn ?? existing.checkedIn;
            // Also ensure teamId is correct if it was wrong/missing
            (existing as any).teamId = request.teamId; 
            
            return await this.lineupRepository.update(existing);
        }

        const newLineup = new MatchLineup(
            uuidv4(),
            request.matchId,
            request.playerId,
            request.teamId,
            request.status,
            request.checkedIn ?? false,
            request.number
        );

        return await this.lineupRepository.create(newLineup);
    }
}
