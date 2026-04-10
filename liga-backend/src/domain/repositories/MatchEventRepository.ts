import { EventType } from "@prisma/client";
import { MatchEvent } from "../entities/MatchEvent";

export interface MatchEventRepository {
    create(event: MatchEvent): Promise<MatchEvent>;
    findByMatch(matchId: string): Promise<MatchEvent[]>;
    findById(id: string): Promise<MatchEvent | null>;
    countYellowCardsInTournament(playerId: string, tournamentId: string): Promise<number>;
    countYellowCardsInMatch(playerId: string, matchId: string): Promise<number>;
    hasRedCardInMatch(playerId: string, matchId: string): Promise<boolean>;
    getTopScorers(tournamentId: string, limit?: number): Promise<any[]>;
    getPlayerStats(playerId: string): Promise<{ goals: number; yellowCards: number; redCards: number }>;
    delete(id: string): Promise<void>;
}
