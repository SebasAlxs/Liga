import { MatchResponse } from "../../../adapters/http/dto/MatchResponse";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { PaginationParams } from "../../../domain/repositories/Pagination";

export class GetAllMatchesUseCase {
    constructor(private matchRepository: MatchRepository) { }

    async execute(pagination?: PaginationParams): Promise<{ items: MatchResponse[]; total: number }> {
        const { items: matches, total } = await this.matchRepository.findAll(pagination);
        const items = matches.map(m => {
            return {
                _id: m.id,
                homeTeamId: m.homeTeamId,
                awayTeamId: m.awayTeamId,
                homeScore: m.homeScore,
                awayScore: m.awayScore,
                matchDate: m.matchDate.toISOString(),
                tournamentId: m.tournamentId,
                categoryId: m.categoryId,
                status: m.status,
                firstHalfStartedAt: m.firstHalfStartedAt ? m.firstHalfStartedAt.toISOString() : null,
                firstHalfEndedAt: m.firstHalfEndedAt ? m.firstHalfEndedAt.toISOString() : null,
                secondHalfStartedAt: m.secondHalfStartedAt ? m.secondHalfStartedAt.toISOString() : null,
                createdAt: m.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: m.updatedAt?.toISOString() || new Date().toISOString(),
                refereeId: m.refereeId,
                assistant1Id: m.assistant1Id,
                assistant2Id: m.assistant2Id,
                fourthRefereeId: m.fourthRefereeId,
                primaryReferee: m.primaryReferee,
                assistant1: m.assistant1,
                assistant2: m.assistant2,
                fourthReferee: m.fourthReferee
            };
        });
        return { items, total };
    }
}
