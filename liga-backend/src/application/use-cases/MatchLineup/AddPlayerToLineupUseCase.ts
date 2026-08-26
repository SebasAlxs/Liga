import { MatchLineup, LineupStatus } from "../../../domain/entities/MatchLineup";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";
import { FineRepository } from "../../../domain/repositories/FineRepository";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";
import { DomainError } from "../../../domain/exceptions/DomainError";
import { v4 as uuidv4 } from "uuid";

export interface AddPlayerToLineupRequest {
    matchId: string;
    playerId: string;
    teamId: string;
    status: LineupStatus;
    number?: number;
    checkedIn?: boolean;
}

export class AddPlayerToLineupUseCase {
    constructor(
        private lineupRepository: MatchLineupRepository,
        private matchRepository: MatchRepository,
        private suspensionRepository: SuspensionRepository,
        private fineRepository: FineRepository,
        private tournamentRepository: TournamentRepository
    ) { }

    async execute(request: AddPlayerToLineupRequest): Promise<MatchLineup> {
        const match = await this.matchRepository.findById(request.matchId);
        if (!match) throw new DomainError("Partido no encontrado.");

        const tournament = await this.tournamentRepository.findById(match.tournamentId);
        if (!tournament) throw new DomainError("Torneo no encontrado.");

        // 1. Validar Suspensión Activa
        const activeSuspensions = await this.suspensionRepository.findByPlayerInTournament(request.playerId, match.tournamentId);
        const hasActiveSuspension = activeSuspensions.find(s => s.status === 'ACTIVE');
        if (hasActiveSuspension) {
            const matchesLeft = hasActiveSuspension.matchesSuspended - hasActiveSuspension.servedMatches;
            throw new DomainError(`Jugador suspendido por: ${hasActiveSuspension.reason}. Le faltan ${matchesLeft} partido(s).`);
        }

        // 2. Validar Multas Pendientes (si el torneo lo requiere)
        if (tournament.blockPlayerWithPendingFines) {
            const playerFines = await this.fineRepository.findByPlayer(request.playerId);
            const pendingFines = playerFines.filter(f => f.status === 'PENDING');
            if (pendingFines.length > 0) {
                throw new DomainError("Jugador inhabilitado por multas pendientes.");
            }
        }

        // Check if player already in lineup
        const existing = await this.lineupRepository.findByMatchAndPlayer(request.matchId, request.playerId);
        
        if (existing) {
            // Update existing record instead of throwing
            existing.status = request.status;
            existing.checkedIn = request.checkedIn ?? existing.checkedIn;
            // Also ensure teamId is correct if it was wrong/missing
            (existing as any).teamId = request.teamId; 
            
            return await this.lineupRepository.update(existing);
        }

        const newLineup = new MatchLineup(
            uuidv4(),
            request.matchId,
            request.playerId,
            request.teamId,
            request.status,
            request.checkedIn ?? false,
            request.number
        );

        return await this.lineupRepository.create(newLineup);
    }
}
