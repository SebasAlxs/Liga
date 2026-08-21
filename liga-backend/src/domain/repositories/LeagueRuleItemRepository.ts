import { LeagueRuleItem } from "../entities/LeagueRuleItem";

export interface LeagueRuleItemRepository {
    findAll(): Promise<LeagueRuleItem[]>;
    findById(id: string): Promise<LeagueRuleItem | null>;
    save(item: LeagueRuleItem): Promise<LeagueRuleItem>;
    update(item: LeagueRuleItem): Promise<LeagueRuleItem>;
    delete(id: string): Promise<void>;
}
