"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlayerFromLineupUseCase = void 0;
class DeletePlayerFromLineupUseCase {
    constructor(lineupRepository) {
        this.lineupRepository = lineupRepository;
    }
    async execute(lineupId) {
        await this.lineupRepository.delete(lineupId);
    }
}
exports.DeletePlayerFromLineupUseCase = DeletePlayerFromLineupUseCase;
