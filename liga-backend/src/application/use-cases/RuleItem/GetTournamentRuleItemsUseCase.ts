
import { RuleItem } from "../../../domain/entities/RuleItem";
import { RuleItemRepository } from "../../../domain/repositories/RuleItemRepository";
export class GetTournamentRuleItemsUseCase {
    constructor(private repository: RuleItemRepository) {}
    async execute(tournamentId: string): Promise<RuleItem[]> {
        return this.repository.findByTournament(tournamentId);
    }
}
