"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchEventsUseCase = void 0;
class GetMatchEventsUseCase {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async execute(matchId) {
        return await this.eventRepository.findByMatch(matchId);
    }
}
exports.GetMatchEventsUseCase = GetMatchEventsUseCase;
