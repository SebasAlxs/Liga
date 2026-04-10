"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPlayerToLineupUseCase = void 0;
const MatchLineup_1 = require("../../../domain/entities/MatchLineup");
const uuid_1 = require("uuid");
class AddPlayerToLineupUseCase {
    constructor(lineupRepository) {
        this.lineupRepository = lineupRepository;
    }
    async execute(request) {
        // Check if player already in lineup
        const existing = await this.lineupRepository.findByMatchAndPlayer(request.matchId, request.playerId);
        if (existing) {
            throw new Error("El jugador ya está en la nómina de este partido.");
        }
        // Logic check: if status is STARTER, maybe count how many starters there are?
        // User said "agregar a los once en campo". 
        // We could enforce 11 max starters, but maybe keep it flexible and just warn in UI.
        // For now, let's keep it simple.
        const newLineup = new MatchLineup_1.MatchLineup((0, uuid_1.v4)(), request.matchId, request.playerId, request.teamId, request.status, false, // default not checked-in
        request.number);
        return await this.lineupRepository.create(newLineup);
    }
}
exports.AddPlayerToLineupUseCase = AddPlayerToLineupUseCase;
