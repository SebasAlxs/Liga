import { PlayerTeamHistory } from "../entities/PlayerTeamHistory";

export interface PlayerTeamHistoryRepository {
    create(playerId: string, teamId: string, startDate?: Date): Promise<PlayerTeamHistory>;
    closeOpenEntry(playerId: string, endDate?: Date): Promise<void>;
    findByPlayer(playerId: string): Promise<PlayerTeamHistory[]>;
}
