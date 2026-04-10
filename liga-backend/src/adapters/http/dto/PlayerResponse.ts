export interface CreatePlayerRequest {
    firstName: string;
    lastName: string;
    number: number;
    teamId: string;
    dni?: string;
    birthDate?: string; // ISO string
    isLocal: boolean;
    picture?: string;
}

export interface UpdatePlayerRequest {
    firstName?: string;
    lastName?: string;
    number?: number;
    teamId?: string;
    dni?: string;
    birthDate?: string;
    isLocal?: boolean;
    picture?: string;
}

export interface PlayerResponse {
    _id: string;
    firstName: string;
    lastName: string;
    number: number;
    teamId: string;
    dni?: string;
    birthDate?: string;
    isLocal: boolean;
    picture?: string; // base64 string
    stats?: {
        goals: number;
        yellowCards: number;
        redCards: number;
    };
    createdAt: string;
    updatedAt: string;
}
