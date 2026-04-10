"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTeamUseCase = void 0;
class UpdateTeamUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(id, request) {
        const existingTeam = await this.teamRepository.findById(id);
        if (!existingTeam) {
            throw new Error("Team not found");
        }
        if (request.name)
            existingTeam.name = request.name;
        if (request.logo !== undefined)
            existingTeam.logo = request.logo;
        if (request.foundedYear !== undefined)
            existingTeam.foundedYear = request.foundedYear;
        if (request.championshipsWon !== undefined)
            existingTeam.championshipsWon = request.championshipsWon;
        if (request.categoryId !== undefined)
            existingTeam.categoryId = request.categoryId;
        if (request.tournamentId !== undefined)
            existingTeam.tournamentId = request.tournamentId;
        const updated = await this.teamRepository.update(existingTeam);
        return {
            _id: updated.id,
            name: updated.name,
            logo: updated.logo,
            foundedYear: updated.foundedYear,
            championshipsWon: updated.championshipsWon ?? null,
            categoryId: updated.categoryId,
            tournamentId: updated.tournamentId,
            points: updated.points,
            matchesPlayed: updated.matchesPlayed,
            matchesWon: updated.matchesWon,
            matchesDrawn: updated.matchesDrawn,
            matchesLost: updated.matchesLost,
            goalsFor: updated.goalsFor,
            goalsAgainst: updated.goalsAgainst,
            goalDifference: updated.goalDifference,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
}
exports.UpdateTeamUseCase = UpdateTeamUseCase;
