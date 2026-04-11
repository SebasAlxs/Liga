import crypto from "crypto";
import { EventType } from "@prisma/client";
import { LineupStatus } from "../../../domain/entities/MatchLineup";
import { MatchEvent } from "../../../domain/entities/MatchEvent";
import { Suspension } from "../../../domain/entities/Suspension";
import { MatchEventRepository } from "../../../domain/repositories/MatchEventRepository";
import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";
import { RecalculateTeamStatsUseCase } from "../Stats/RecalculateTeamStatsUseCase";

// Dto
export interface AddMatchEventRequest {
    matchId: string;
    playerId: string;
    teamId: string;
    type: EventType;
    minute?: number;
    tournamentId: string; // The UI should send this for faster querying, otherwise we'd need to fetch Match first
    relatedPlayerId?: string; // For substitutions
}

export class AddMatchEventUseCase {
    constructor(
        private eventRepository: MatchEventRepository,
        private suspensionRepository: SuspensionRepository,
        private tournamentRepository: TournamentRepository,
        private matchRepository: MatchRepository,
        private lineupRepository: MatchLineupRepository,
        private teamStatsUseCase: RecalculateTeamStatsUseCase
    ) { }

    async execute(request: AddMatchEventRequest): Promise<MatchEvent> {
        // 1. Verificar si el jugador ya está expulsado en este partido
        const hasRed = await this.eventRepository.hasRedCardInMatch(request.playerId, request.matchId);
        const yellowCountInMatch = await this.eventRepository.countYellowCardsInMatch(request.playerId, request.matchId);

        if (hasRed || yellowCountInMatch >= 2) {
            throw new Error("El jugador ya ha sido expulsado de este partido y no puede recibir más eventos.");
        }

        const event = new MatchEvent(
            crypto.randomUUID(),
            request.matchId,
            request.playerId,
            request.teamId,
            request.type,
            request.minute,
            request.relatedPlayerId
        );

        const createdEvent = await this.eventRepository.create(event);

        // --- Lógica Especial de Sustitución ---
        if (request.type === "SUBSTITUTION" && request.relatedPlayerId) {
            // PlayerId sale, RelatedPlayerId entra
            const outLineup = await this.lineupRepository.findByMatchAndPlayer(request.matchId, request.playerId);
            const inLineup = await this.lineupRepository.findByMatchAndPlayer(request.matchId, request.relatedPlayerId);

            if (outLineup) {
                outLineup.status = LineupStatus.SUBSTITUTE;
                await this.lineupRepository.update(outLineup);
            }
            if (inLineup) {
                inLineup.status = LineupStatus.STARTER;
                await this.lineupRepository.update(inLineup);
            }
        }

        // Lógica Automática de Sanciones
        if (request.type === "RED_CARD") {
            // Roja directa = Suspención inmediata (1 partido)
            const suspension = new Suspension(
                crypto.randomUUID(),
                request.playerId,
                request.tournamentId,
                "Roja Directa",
                1,
                "ACTIVE",
                request.matchId
            );
            await this.suspensionRepository.create(suspension);
        } else if (request.type === "YELLOW_CARD") {
            // A. Doble Amarilla en el mismo partido
            if (yellowCountInMatch === 1) { // Este es el segundo que estamos agregando
                const suspension = new Suspension(
                    crypto.randomUUID(),
                    request.playerId,
                    request.tournamentId,
                    "Doble Tarjeta Amarilla (Expulsión)",
                    1,
                    "ACTIVE",
                    request.matchId
                );
                await this.suspensionRepository.create(suspension);
            } else {
                // B. Verificar si acumula amarillas en el torneo
                const tournament = await this.tournamentRepository.findById(request.tournamentId);
                if (tournament) {
                    const yellowCardCountTotal = await this.eventRepository.countYellowCardsInTournament(
                        request.playerId,
                        request.tournamentId
                    );

                    const limit = tournament.maxYellowCardsForSuspension;

                    // Si el conteo total es múltiplo exacto del límite
                    if (yellowCardCountTotal > 0 && yellowCardCountTotal % limit === 0) {
                        const suspension = new Suspension(
                            crypto.randomUUID(),
                            request.playerId,
                            request.tournamentId,
                            `Acumulación de ${limit} Tarjetas Amarillas`,
                            1,
                            "ACTIVE",
                            request.matchId
                        );
                        await this.suspensionRepository.create(suspension);
                    }
                }
            }
        } else if (request.type === "GOAL") {
            const match = await this.matchRepository.findById(request.matchId);
            if (match) {
                if (match.homeTeamId === request.teamId) {
                    match.homeScore = (match.homeScore || 0) + 1;
                } else if (match.awayTeamId === request.teamId) {
                    match.awayScore = (match.awayScore || 0) + 1;
                }
                await this.matchRepository.update(match);

                if (match.status === "FINISHED") {
                    await this.teamStatsUseCase.execute(match.homeTeamId);
                    await this.teamStatsUseCase.execute(match.awayTeamId);
                }
            }
        }

        return createdEvent;
    }
}
