import { randomUUID } from "crypto";
import { CreateLeagueRuleItemRequest, LeagueRuleItemResponse } from "../../../adapters/http/dto/LeagueRuleItemResponse";
import { LeagueRuleItem } from "../../../domain/entities/LeagueRuleItem";
import { LeagueRuleItemRepository } from "../../../domain/repositories/LeagueRuleItemRepository";

export class CreateLeagueRuleItemUseCase {
    constructor(private leagueRuleItemRepository: LeagueRuleItemRepository) { }

    async execute(request: CreateLeagueRuleItemRequest): Promise<LeagueRuleItemResponse> {
        const item = new LeagueRuleItem(randomUUID(), request.title, request.description);
        const created = await this.leagueRuleItemRepository.save(item);
        return {
            _id: created.id,
            title: created.title,
            description: created.description ?? null,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
