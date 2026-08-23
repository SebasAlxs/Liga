import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";

export class DeleteMatchUseCase {
    constructor(private matchRepository: MatchRepository) { }

    async execute(id: string): Promise<void> {
        const existingMatch = await this.matchRepository.findById(id);
        if (!existingMatch) {
            throw new NotFoundError("Match not found");
        }
        await this.matchRepository.delete(id);
    }
}
