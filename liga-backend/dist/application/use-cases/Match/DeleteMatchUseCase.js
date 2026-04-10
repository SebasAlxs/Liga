"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMatchUseCase = void 0;
class DeleteMatchUseCase {
    constructor(matchRepository) {
        this.matchRepository = matchRepository;
    }
    async execute(id) {
        const existingMatch = await this.matchRepository.findById(id);
        if (!existingMatch) {
            throw new Error("Match not found");
        }
        await this.matchRepository.delete(id);
    }
}
exports.DeleteMatchUseCase = DeleteMatchUseCase;
