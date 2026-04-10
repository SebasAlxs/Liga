import { MatchLineup } from "../entities/MatchLineup";

export interface MatchLineupRepository {
    create(lineup: MatchLineup): Promise<MatchLineup>;
    findById(id: string): Promise<MatchLineup | null>;
    findByMatchAndPlayer(matchId: string, playerId: string): Promise<MatchLineup | null>;
    findByMatch(matchId: string): Promise<MatchLineup[]>;
    update(lineup: MatchLineup): Promise<MatchLineup>;
    delete(id: string): Promise<void>;
}
