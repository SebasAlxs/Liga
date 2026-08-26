
import { RuleItem } from "../../../domain/entities/RuleItem";
import { RuleItemRepository } from "../../../domain/repositories/RuleItemRepository";
import crypto from "crypto";

export interface CreateRuleItemRequest {
    tournamentId: string;
    title: string;
    description?: string;
}

export class CreateRuleItemUseCase {
    constructor(private repository: RuleItemRepository) {}
    async execute(request: CreateRuleItemRequest): Promise<RuleItem> {
        const item = new RuleItem(crypto.randomUUID(), request.tournamentId, request.title, request.description);
        return this.repository.create(item);
    }
}
