import { LeagueRuleItemRepository } from "../../../domain/repositories/LeagueRuleItemRepository";

export class DeleteLeagueRuleItemUseCase {
    constructor(private leagueRuleItemRepository: LeagueRuleItemRepository) { }

    async execute(id: string): Promise<void> {
        const existing = await this.leagueRuleItemRepository.findById(id);
        if (!existing) {
            throw new Error("Regla no encontrada");
        }
        await this.leagueRuleItemRepository.delete(id);
    }
}
