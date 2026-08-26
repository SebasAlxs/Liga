import { RuleItem } from "../entities/RuleItem";

export interface RuleItemRepository {
    create(ruleItem: RuleItem): Promise<RuleItem>;
    update(ruleItem: RuleItem): Promise<RuleItem>;
    delete(id: string): Promise<void>;
    findByTournament(tournamentId: string): Promise<RuleItem[]>;
    findById(id: string): Promise<RuleItem | null>;
}
