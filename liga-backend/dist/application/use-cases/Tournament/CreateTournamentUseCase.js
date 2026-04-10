"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTournamentUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Tournament_1 = require("../../../domain/entities/Tournament");
class CreateTournamentUseCase {
    constructor(tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }
    async execute(request) {
        const tournament = new Tournament_1.Tournament(crypto_1.default.randomUUID(), request.name, request.headquartersId, request.maxYellowCardsForSuspension ?? 3, request.active ?? true);
        const created = await this.tournamentRepository.save(tournament);
        return {
            _id: created.id,
            name: created.name,
            headquartersId: created.headquartersId,
            maxYellowCardsForSuspension: created.maxYellowCardsForSuspension,
            active: created.active,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
exports.CreateTournamentUseCase = CreateTournamentUseCase;
