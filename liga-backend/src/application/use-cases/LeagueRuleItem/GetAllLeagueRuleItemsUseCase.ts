import { LeagueRuleItemResponse } from "../../../adapters/http/dto/LeagueRuleItemResponse";
import { LeagueRuleItemRepository } from "../../../domain/repositories/LeagueRuleItemRepository";

export class GetAllLeagueRuleItemsUseCase {
    constructor(private leagueRuleItemRepository: LeagueRuleItemRepository) { }

    async execute(): Promise<LeagueRuleItemResponse[]> {
        const items = await this.leagueRuleItemRepository.findAll();
        return items.map((i) => ({
            _id: i.id,
            title: i.title,
            description: i.description ?? null,
            createdAt: i.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: i.updatedAt?.toISOString() || new Date().toISOString(),
        }));
    }
}
