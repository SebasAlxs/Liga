"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Team_1 = require("../../../domain/entities/Team");
class CreateTeamUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(request) {
        const team = new Team_1.Team(crypto_1.default.randomUUID(), request.name, request.logo || "", request.foundedYear, request.championshipsWon, request.categoryId, request.tournamentId);
        const created = await this.teamRepository.create(team);
        return {
            _id: created.id,
            name: created.name,
            logo: created.logo,
            foundedYear: created.foundedYear,
            championshipsWon: created.championshipsWon ?? null,
            categoryId: created.categoryId,
            tournamentId: created.tournamentId,
            points: created.points,
            matchesPlayed: created.matchesPlayed,
            matchesWon: created.matchesWon,
            matchesDrawn: created.matchesDrawn,
            matchesLost: created.matchesLost,
            goalsFor: created.goalsFor,
            goalsAgainst: created.goalsAgainst,
            goalDifference: created.goalDifference,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
}
exports.CreateTeamUseCase = CreateTeamUseCase;
