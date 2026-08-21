import { LeagueRules } from "../entities/LeagueRules";

export interface LeagueRulesUpdateInput {
    maxForeignPlayersOnField?: number;
}

export interface LeagueRulesRepository {
    get(): Promise<LeagueRules>;
    update(data: LeagueRulesUpdateInput): Promise<LeagueRules>;
}
