import { MatchResponse } from "../../../adapters/http/dto/MatchResponse";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";

export class GetAllMatchesUseCase {
    constructor(private matchRepository: MatchRepository) { }

    async execute(): Promise<MatchResponse[]> {
        const matches = await this.matchRepository.findAll();
        return matches.map(m => {
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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
    }
}
