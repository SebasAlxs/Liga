import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { MatchEventRepository } from "../../../domain/repositories/MatchEventRepository";

export interface PlayerMatchHistoryResponse {
    matchId: string;
    matchDate: string;
    status: string;
    homeTeamId: string;
    homeTeamName: string;
    homeTeamLogo?: string;
    awayTeamId: string;
    awayTeamName: string;
    awayTeamLogo?: string;
    homeScore: number | null;
    awayScore: number | null;
    isHome: boolean;
    result: "W" | "D" | "L" | null;
    goals: number;
    yellowCards: number;
    redCards: number;
}

export class GetPlayerMatchHistoryUseCase {
    constructor(
        private lineupRepository: MatchLineupRepository,
        private matchRepository: MatchRepository,
        private teamRepository: TeamRepository,
        private eventRepository: MatchEventRepository
    ) { }

    async execute(playerId: string): Promise<PlayerMatchHistoryResponse[]> {
        const lineups = await this.lineupRepository.findByPlayer(playerId);
        if (lineups.length === 0) return [];

        const matches = await Promise.all(lineups.map(l => this.matchRepository.findById(l.matchId)));

        const teamIds = new Set<string>();
        matches.forEach(m => { if (m) { teamIds.add(m.homeTeamId); teamIds.add(m.awayTeamId); } });
        const teams = await Promise.all([...teamIds].map(id => this.teamRepository.findById(id)));
        const teamById = new Map(teams.filter((t): t is NonNullable<typeof t> => !!t).map(t => [t.id, t]));

        const results: PlayerMatchHistoryResponse[] = [];

        for (let i = 0; i < lineups.length; i++) {
            const match = matches[i];
            if (!match) continue;

            const events = await this.eventRepository.findByMatch(match.id);
            const playerEvents = events.filter(e => e.playerId === playerId);
            const goals = playerEvents.filter(e => e.type === "GOAL").length;
            const yellowCards = playerEvents.filter(e => e.type === "YELLOW_CARD").length;
            const redCards = playerEvents.filter(e => e.type === "RED_CARD").length;

            const homeTeam = teamById.get(match.homeTeamId);
            const awayTeam = teamById.get(match.awayTeamId);
            const isHome = match.homeTeamId === lineups[i].teamId;

            let result: "W" | "D" | "L" | null = null;
            if (match.homeScore !== null && match.awayScore !== null) {
                if (match.homeScore === match.awayScore) result = "D";
                else if ((match.homeScore > match.awayScore) === isHome) result = "W";
                else result = "L";
            }

            results.push({
                matchId: match.id,
                matchDate: match.matchDate.toISOString(),
                status: match.status,
                homeTeamId: match.homeTeamId,
                homeTeamName: homeTeam?.name || "Desconocido",
                homeTeamLogo: homeTeam?.logo,
                awayTeamId: match.awayTeamId,
                awayTeamName: awayTeam?.name || "Desconocido",
                awayTeamLogo: awayTeam?.logo,
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                isHome,
                result,
                goals,
                yellowCards,
                redCards,
            });
        }

        return results;
    }
}
