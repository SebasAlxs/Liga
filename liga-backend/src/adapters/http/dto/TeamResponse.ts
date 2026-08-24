export interface CreateTeamRequest {
    name: string;
    logo?: string;
    foundedYear: number;
    championshipsWon?: number;
    categoryId?: string;
    tournamentId?: string;
    managerId?: string;
}

export interface UpdateTeamRequest {
    name?: string;
    logo?: string;
    foundedYear?: number;
    championshipsWon?: number;
    categoryId?: string;
    tournamentId?: string;
}

export interface TeamResponse {
    id: string;
    name: string;
    logo: string;
    foundedYear: number;
    championshipsWon: number | null;
    categoryId?: string;
    tournamentId?: string;
    points: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesDrawn: number;
    matchesLost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    createdAt?: string;
    updatedAt?: string;
    managerId?: string;
}
