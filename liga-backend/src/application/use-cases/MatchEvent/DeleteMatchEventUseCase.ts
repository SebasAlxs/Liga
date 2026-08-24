import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { MatchEventRepository } from "../../../domain/repositories/MatchEventRepository";
import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { FineRepository } from "../../../domain/repositories/FineRepository";
import { RecalculateTeamStatsUseCase } from "../Stats/RecalculateTeamStatsUseCase";

export class DeleteMatchEventUseCase {
    constructor(
        private eventRepository: MatchEventRepository,
        private suspensionRepository: SuspensionRepository,
        private matchRepository: MatchRepository,
        private teamStatsUseCase: RecalculateTeamStatsUseCase,
        private fineRepository: FineRepository
    ) { }

    async execute(id: string): Promise<void> {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new NotFoundError("Evento no encontrado.");
        }

        const match = await this.matchRepository.findById(event.matchId);
        if (!match) {
            throw new NotFoundError("Partido no encontrado para este evento.");
        }

        // Side Effects based on event type
        if (event.type === "GOAL") {
            if (match.homeTeamId === event.teamId) {
                match.homeScore = Math.max(0, (match.homeScore || 0) - 1);
            } else if (match.awayTeamId === event.teamId) {
                match.awayScore = Math.max(0, (match.awayScore || 0) - 1);
            }
            await this.matchRepository.update(match);
        } else if (event.type === "RED_CARD" || event.type === "YELLOW_CARD") {
            // Delete associated suspension
            // For RED_CARD it's direct. For YELLOW_CARD it's only if it was an accumulation one.
            // deleteByMatch handles both if they exist.
            await this.suspensionRepository.deleteByMatch(event.matchId, event.playerId);
            // Delete the fine that was auto-generated for this specific card event, if any.
            await this.fineRepository.deleteByMatchEventId(event.id);
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
