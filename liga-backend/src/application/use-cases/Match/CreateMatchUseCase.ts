import crypto from "crypto";
import { CreateMatchRequest, MatchResponse } from "../../../adapters/http/dto/MatchResponse";
import { Match, MatchStatus } from "../../../domain/entities/Match";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";

export class CreateMatchUseCase {
    constructor(private matchRepository: MatchRepository) { }

    async execute(request: CreateMatchRequest): Promise<MatchResponse> {
        const match = new Match(
            crypto.randomUUID(),
            request.homeTeamId,
            request.awayTeamId,
            request.homeScore ?? null,
            request.awayScore ?? null,
            new Date(request.matchDate),
            request.tournamentId,
            request.categoryId,
            request.status || MatchStatus.SCHEDULED,
            request.refereeId,
            request.assistant1Id,
            request.assistant2Id,
            request.fourthRefereeId
        );

        const created = await this.matchRepository.create(match);

        return {
            _id: created.id,
            homeTeamId: created.homeTeamId,
            awayTeamId: created.awayTeamId,
            homeScore: created.homeScore,
            awayScore: created.awayScore,
            matchDate: created.matchDate.toISOString(),
            tournamentId: created.tournamentId,
            categoryId: created.categoryId,
            status: created.status,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
            refereeId: created.refereeId,
            assistant1Id: created.assistant1Id,
            assistant2Id: created.assistant2Id,
            fourthRefereeId: created.fourthRefereeId,
            primaryReferee: created.primaryReferee,
            assistant1: created.assistant1,
            assistant2: created.assistant2,
            fourthReferee: created.fourthReferee
        };
    }
}
