export interface LeagueRulesResponse {
    _id: string;
    maxForeignPlayersOnField: number;
}

export interface UpdateLeagueRulesRequest {
    maxForeignPlayersOnField?: number;
}
