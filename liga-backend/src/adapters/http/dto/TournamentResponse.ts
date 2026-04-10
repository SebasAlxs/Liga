export interface TournamentResponse {
    _id: string;
    name: string;
    headquartersId?: string;
    maxYellowCardsForSuspension: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTournamentRequest {
    name: string;
    headquartersId?: string;
    maxYellowCardsForSuspension?: number;
    active?: boolean;
}

export interface UpdateTournamentRequest {
    name?: string;
    headquartersId?: string;
    maxYellowCardsForSuspension?: number;
    active?: boolean;
}
