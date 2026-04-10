import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";

export class DeletePlayerUseCase {
    constructor(private playerRepository: PlayerRepository) { }

    async execute(id: string): Promise<void> {
        const existingPlayer = await this.playerRepository.findById(id);
        if (!existingPlayer) {
            throw new Error("Player not found");
        }
        await this.playerRepository.delete(id);
    }
}
