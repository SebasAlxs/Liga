import { MatchResponse } from "../../../adapters/http/dto/MatchResponse";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";

export class GetMatchByIdUseCase {
    constructor(private matchRepository: MatchRepository) { }

    async execute(id: string): Promise<MatchResponse | null> {
        const match = await this.matchRepository.findById(id);
        if (!match) return null;

        return {
            _id: match.id,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            matchDate: match.matchDate.toISOString(),
            tournamentId: match.tournamentId,
            categoryId: match.categoryId,
            status: match.status,
            firstHalfStartedAt: match.firstHalfStartedAt ? match.firstHalfStartedAt.toISOString() : null,
            firstHalfEndedAt: match.firstHalfEndedAt ? match.firstHalfEndedAt.toISOString() : null,
            secondHalfStartedAt: match.secondHalfStartedAt ? match.secondHalfStartedAt.toISOString() : null,
            createdAt: match.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: match.updatedAt?.toISOString() || new Date().toISOString(),
            refereeId: match.refereeId,
            assistant1Id: match.assistant1Id,
            assistant2Id: match.assistant2Id,
            fourthRefereeId: match.fourthRefereeId,
            primaryReferee: match.primaryReferee,
            assistant1: match.assistant1,
            assistant2: match.assistant2,
            fourthReferee: match.fourthReferee
        };
    }
}
