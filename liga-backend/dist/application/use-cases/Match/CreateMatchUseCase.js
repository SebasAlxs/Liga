"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMatchUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Match_1 = require("../../../domain/entities/Match");
class CreateMatchUseCase {
    constructor(matchRepository) {
        this.matchRepository = matchRepository;
    }
    async execute(request) {
        const match = new Match_1.Match(crypto_1.default.randomUUID(), request.homeTeamId, request.awayTeamId, request.homeScore ?? null, request.awayScore ?? null, new Date(request.matchDate), request.tournamentId, request.categoryId, request.status || Match_1.MatchStatus.SCHEDULED);
        const created = await this.matchRepository.create(match);
        return {
            _id: created.id,
            homeTeamId: created.homeTeamId,
            awayTeamId: created.awayTeamId,
            homeScore: created.homeScore,
            awayScore: created.awayScore,
            matchDate: created.matchDate.toISOString(),
            tournamentId: created.tournamentId,
            categoryId: created.categoryId,
            status: created.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
}
exports.CreateMatchUseCase = CreateMatchUseCase;
