"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlayerUseCase = void 0;
class DeletePlayerUseCase {
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async execute(id) {
        const existingPlayer = await this.playerRepository.findById(id);
        if (!existingPlayer) {
            throw new Error("Player not found");
        }
        await this.playerRepository.delete(id);
    }
}
exports.DeletePlayerUseCase = DeletePlayerUseCase;
