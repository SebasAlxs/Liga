import { Suspension, SuspensionStatus } from "../entities/Suspension";

export interface SuspensionRepository {
    create(suspension: Suspension): Promise<Suspension>;
    findByPlayerInTournament(playerId: string, tournamentId: string): Promise<Suspension[]>;
    updateStatus(id: string, status: SuspensionStatus): Promise<Suspension>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Suspension[]>;
    deleteByMatch(matchId: string, playerId: string): Promise<void>;
    findActiveByTeamAndTournament(teamId: string, tournamentId: string): Promise<Suspension[]>;
    deleteByFineId(fineId: string): Promise<void>;
}

