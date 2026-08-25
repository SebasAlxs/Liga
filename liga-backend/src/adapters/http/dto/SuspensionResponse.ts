import { SuspensionStatus } from "../../../domain/entities/Suspension";

export interface SuspensionResponse {
    id: string;
    playerId: string;
    playerName: string;
    playerNumber?: number;
    teamId?: string;
    teamName?: string;
    tournamentId: string;
    matchId?: string;
    reason: string;
    matchesSuspended: number;
    status: SuspensionStatus;
    createdAt?: string;
    updatedAt?: string;
}
