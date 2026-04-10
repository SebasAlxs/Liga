import { MatchEvent } from "../../../domain/entities/MatchEvent";
import { MatchEventRepository } from "../../../domain/repositories/MatchEventRepository";

export class GetMatchEventsUseCase {
    constructor(private eventRepository: MatchEventRepository) { }

    async execute(matchId: string): Promise<MatchEvent[]> {
        return await this.eventRepository.findByMatch(matchId);
    }
}
