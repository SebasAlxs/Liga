
import { RuleItemRepository } from "../../../domain/repositories/RuleItemRepository";
export class DeleteRuleItemUseCase {
    constructor(private repository: RuleItemRepository) {}
    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
