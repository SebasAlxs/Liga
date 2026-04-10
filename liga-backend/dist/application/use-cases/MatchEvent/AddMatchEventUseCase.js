"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMatchEventUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const MatchEvent_1 = require("../../../domain/entities/MatchEvent");
const Suspension_1 = require("../../../domain/entities/Suspension");
class AddMatchEventUseCase {
    constructor(eventRepository, suspensionRepository, tournamentRepository, matchRepository, teamStatsUseCase) {
        this.eventRepository = eventRepository;
        this.suspensionRepository = suspensionRepository;
        this.tournamentRepository = tournamentRepository;
        this.matchRepository = matchRepository;
        this.teamStatsUseCase = teamStatsUseCase;
    }
    async execute(request) {
        const event = new MatchEvent_1.MatchEvent(crypto_1.default.randomUUID(), request.matchId, request.playerId, request.teamId, request.type, request.minute);
        const createdEvent = await this.eventRepository.create(event);
        // Lógica Automática de Sanciones
        if (request.type === "RED_CARD") {
            // Roja directa = Suspención inmediata (1 partido)
            const suspension = new Suspension_1.Suspension(crypto_1.default.randomUUID(), request.playerId, request.tournamentId, "Roja Directa", 1, "ACTIVE", request.matchId);
            await this.suspensionRepository.create(suspension);
        }
        else if (request.type === "YELLOW_CARD") {
            // Verificar si acumula amarillas
            const tournament = await this.tournamentRepository.findById(request.tournamentId);
            if (tournament) {
                const yellowCardCount = await this.eventRepository.countYellowCardsInTournament(request.playerId, request.tournamentId);
                const limit = tournament.maxYellowCardsForSuspension;
                // Si el conteo actual de tarjetas amarillas es múltiplo exacto del límite (ej. 3, 6, 9)
                if (yellowCardCount > 0 && yellowCardCount % limit === 0) {
                    const suspension = new Suspension_1.Suspension(crypto_1.default.randomUUID(), request.playerId, request.tournamentId, `Acumulación de ${limit} Tarjetas Amarillas`, 1, // suspende 1 partido por defecto
                    "ACTIVE", request.matchId);
                    await this.suspensionRepository.create(suspension);
                }
            }
        }
        else if (request.type === "GOAL") {
            const match = await this.matchRepository.findById(request.matchId);
            if (match) {
                if (match.homeTeamId === request.teamId) {
                    match.homeScore = (match.homeScore || 0) + 1;
                }
                else if (match.awayTeamId === request.teamId) {
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
exports.AddMatchEventUseCase = AddMatchEventUseCase;
