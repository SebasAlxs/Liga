"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMatchEventUseCase = void 0;
class DeleteMatchEventUseCase {
    constructor(eventRepository, suspensionRepository, matchRepository, teamStatsUseCase) {
        this.eventRepository = eventRepository;
        this.suspensionRepository = suspensionRepository;
        this.matchRepository = matchRepository;
        this.teamStatsUseCase = teamStatsUseCase;
    }
    async execute(id) {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new Error("Evento no encontrado.");
        }
        const match = await this.matchRepository.findById(event.matchId);
        if (!match) {
            throw new Error("Partido no encontrado para este evento.");
        }
        // Side Effects based on event type
        if (event.type === "GOAL") {
            if (match.homeTeamId === event.teamId) {
                match.homeScore = Math.max(0, (match.homeScore || 0) - 1);
            }
            else if (match.awayTeamId === event.teamId) {
                match.awayScore = Math.max(0, (match.awayScore || 0) - 1);
            }
            await this.matchRepository.update(match);
        }
        else if (event.type === "RED_CARD" || event.type === "YELLOW_CARD") {
            // Delete associated suspension
            // For RED_CARD it's direct. For YELLOW_CARD it's only if it was an accumulation one.
            // deleteByMatch handles both if they exist.
            await this.suspensionRepository.deleteByMatch(event.matchId, event.playerId);
        }
        // Delete the event
        await this.eventRepository.delete(id);
        // Recalculate stats if match is finished
        if (match.status === "FINISHED") {
            await this.teamStatsUseCase.execute(match.homeTeamId);
            await this.teamStatsUseCase.execute(match.awayTeamId);
        }
    }
}
exports.DeleteMatchEventUseCase = DeleteMatchEventUseCase;
