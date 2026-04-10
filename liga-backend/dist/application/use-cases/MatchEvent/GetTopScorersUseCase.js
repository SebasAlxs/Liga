"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTopScorersUseCase = void 0;
class GetTopScorersUseCase {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async execute(tournamentId, limit = 20) {
        return this.eventRepository.getTopScorers(tournamentId, limit);
    }
}
exports.GetTopScorersUseCase = GetTopScorersUseCase;
