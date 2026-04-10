"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayerSuspensionsUseCase = void 0;
class GetPlayerSuspensionsUseCase {
    constructor(suspensionRepository) {
        this.suspensionRepository = suspensionRepository;
    }
    async execute(playerId, tournamentId) {
        return await this.suspensionRepository.findByPlayerInTournament(playerId, tournamentId);
    }
}
exports.GetPlayerSuspensionsUseCase = GetPlayerSuspensionsUseCase;
