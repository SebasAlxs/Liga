"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchLineupUseCase = void 0;
class GetMatchLineupUseCase {
    constructor(lineupRepository) {
        this.lineupRepository = lineupRepository;
    }
    async execute(matchId) {
        return await this.lineupRepository.findByMatch(matchId);
    }
}
exports.GetMatchLineupUseCase = GetMatchLineupUseCase;
