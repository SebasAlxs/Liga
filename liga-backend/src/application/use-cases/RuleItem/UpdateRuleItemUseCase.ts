
import { RuleItem } from "../../../domain/entities/RuleItem";
import { RuleItemRepository } from "../../../domain/repositories/RuleItemRepository";
import { NotFoundError } from "../../../domain/exceptions/NotFoundError";

export interface UpdateRuleItemRequest {
    title?: string;
    description?: string;
}

export class UpdateRuleItemUseCase {
    constructor(private repository: RuleItemRepository) {}
    async execute(id: string, request: UpdateRuleItemRequest): Promise<RuleItem> {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("RuleItem not found");
        if (request.title !== undefined) existing.title = request.title;
        if (request.description !== undefined) existing.description = request.description;
        return this.repository.update(existing);
    }
}
