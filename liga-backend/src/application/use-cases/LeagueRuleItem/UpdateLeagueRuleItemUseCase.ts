import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { LeagueRuleItemResponse, UpdateLeagueRuleItemRequest } from "../../../adapters/http/dto/LeagueRuleItemResponse";
import { LeagueRuleItemRepository } from "../../../domain/repositories/LeagueRuleItemRepository";

export class UpdateLeagueRuleItemUseCase {
    constructor(private leagueRuleItemRepository: LeagueRuleItemRepository) { }

    async execute(id: string, request: UpdateLeagueRuleItemRequest): Promise<LeagueRuleItemResponse> {
        const existing = await this.leagueRuleItemRepository.findById(id);
        if (!existing) {
            throw new NotFoundError("Regla no encontrada");
        }

        if (request.title !== undefined) existing.title = request.title;
        if (request.description !== undefined) existing.description = request.description;

        const updated = await this.leagueRuleItemRepository.update(existing);

        return {
            _id: updated.id,
            title: updated.title,
            description: updated.description ?? null,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
