import { MatchStatus } from "../../../domain/entities/Match";

export interface CreateMatchRequest {
    homeTeamId: string;
    awayTeamId: string;
    homeScore?: number | null;
    awayScore?: number | null;
    matchDate: string;
    tournamentId: string;
    categoryId: string;
    status?: MatchStatus;
    refereeId?: string | null;
    assistant1Id?: string | null;
    assistant2Id?: string | null;
    fourthRefereeId?: string | null;
}

export interface UpdateMatchRequest {
    homeTeamId?: string;
    awayTeamId?: string;
    homeScore?: number | null;
    awayScore?: number | null;
    matchDate?: string;
    tournamentId?: string;
    categoryId?: string;
    status?: MatchStatus;
    firstHalfStartedAt?: string | null;
    firstHalfEndedAt?: string | null;
    secondHalfStartedAt?: string | null;
    refereeId?: string | null;
    assistant1Id?: string | null;
    assistant2Id?: string | null;
    fourthRefereeId?: string | null;
}

export interface MatchResponse {
    _id: string;
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number | null;
    awayScore: number | null;
    matchDate: string;
    tournamentId: string;
    categoryId: string;
    status: MatchStatus;
    createdAt: string;
    updatedAt: string;
    firstHalfStartedAt?: string | null;
    firstHalfEndedAt?: string | null;
    secondHalfStartedAt?: string | null;
    refereeId?: string | null;
    assistant1Id?: string | null;
    assistant2Id?: string | null;
    fourthRefereeId?: string | null;
    primaryReferee?: any;
    assistant1?: any;
    assistant2?: any;
    fourthReferee?: any;
}
