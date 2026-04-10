import { SuspensionStatus } from "@prisma/client";
import { Suspension } from "../entities/Suspension";

export interface SuspensionRepository {
    create(suspension: Suspension): Promise<Suspension>;
    findByPlayerInTournament(playerId: string, tournamentId: string): Promise<Suspension[]>;
    updateStatus(id: string, status: SuspensionStatus): Promise<Suspension>;
    delete(id: string): Promise<void>;
    deleteByMatch(matchId: string, playerId: string): Promise<void>;
}
