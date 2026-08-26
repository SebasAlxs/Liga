export interface TournamentResponse {
    _id: string;
    name: string;
    headquartersId?: string;
    maxYellowCardsForSuspension: number;
    active: boolean;
    blockPlayerWithPendingFines: boolean;
    maxForeignPlayersOnField: number;
    maxPlayersOnField: number;
    minPlayersToStartMatch: number;
    matchHalfDurationMinutes: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTournamentRequest {
    name: string;
    headquartersId?: string;
    maxYellowCardsForSuspension?: number;
    active?: boolean;
    blockPlayerWithPendingFines?: boolean;
    maxForeignPlayersOnField?: number;
    maxPlayersOnField?: number;
    minPlayersToStartMatch?: number;
    matchHalfDurationMinutes?: number;
}

export interface UpdateTournamentRequest {
    name?: string;
    headquartersId?: string;
    maxYellowCardsForSuspension?: number;
    active?: boolean;
    blockPlayerWithPendingFines?: boolean;
    maxForeignPlayersOnField?: number;
    maxPlayersOnField?: number;
    minPlayersToStartMatch?: number;
    matchHalfDurationMinutes?: number;
}
