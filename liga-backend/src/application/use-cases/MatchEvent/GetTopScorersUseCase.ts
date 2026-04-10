import { MatchEventRepository } from "../../../domain/repositories/MatchEventRepository";

export class GetTopScorersUseCase {
    constructor(private eventRepository: MatchEventRepository) { }

    async execute(tournamentId: string, limit: number = 20): Promise<any[]> {
        return this.eventRepository.getTopScorers(tournamentId, limit);
    }
}
