export interface FixturePdfMatch {
    homeTeam: string;
    awayTeam: string;
}

export interface FixturePdfRound {
    round: number;
    matches: FixturePdfMatch[];
}

export interface FixturePdfResponse {
    tournamentId: string;
    categoryId: string;
    tournamentName: string;
    categoryName: string;
    rounds: FixturePdfRound[];
    generatedAt: string;
}
