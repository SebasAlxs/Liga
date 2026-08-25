import { EventType } from "../../../domain/entities/MatchEvent";
import { LineupStatus } from "../../../domain/entities/MatchLineup";
import { MatchStatus } from "../../../domain/entities/Match";

export interface VocaliaSheetLineupPlayer {
    playerId: string;
    firstName: string;
    lastName: string;
    number?: number | null;
    dni?: string;
    status: LineupStatus;
    checkedIn: boolean;
}

export interface VocaliaSheetTeam {
    id: string;
    name: string;
    logo?: string;
    starters: VocaliaSheetLineupPlayer[];
    substitutes: VocaliaSheetLineupPlayer[];
}

export interface VocaliaSheetEvent {
    minute?: number;
    type: EventType;
    teamId: string;
    playerName: string;
    relatedPlayerName?: string;
}

export interface VocaliaSheetResponse {
    matchId: string;
    matchDate: string;
    status: MatchStatus;
    homeScore: number | null;
    awayScore: number | null;
    tournamentName?: string;
    categoryName?: string;
    homeTeam: VocaliaSheetTeam;
    awayTeam: VocaliaSheetTeam;
    referee?: { name: string } | null;
    assistant1?: { name: string } | null;
    assistant2?: { name: string } | null;
    events: VocaliaSheetEvent[];
    generatedAt: string;
}
