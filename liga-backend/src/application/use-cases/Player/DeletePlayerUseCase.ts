import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";

export class DeletePlayerUseCase {
    constructor(private playerRepository: PlayerRepository) { }

    async execute(id: string): Promise<void> {
        const existingPlayer = await this.playerRepository.findById(id);
        if (!existingPlayer) {
            throw new NotFoundError("Player not found");
        }
        await this.playerRepository.delete(id);
    }
}
