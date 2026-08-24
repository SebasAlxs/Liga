import { DomainError } from "../../../domain/exceptions/DomainError";
import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { TeamResponse, UpdateTeamRequest } from "../../../adapters/http/dto/TeamResponse";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export class UpdateTeamUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(id: string, request: UpdateTeamRequest, user?: { id: string, role: string }): Promise<TeamResponse> {
        const existingTeam = await this.teamRepository.findById(id);
        if (!existingTeam) {
            throw new NotFoundError("Team not found");
        }

        if (user) {
            if (user.role === 'DIRIGENTE') {
                if (existingTeam.managerId !== user.id) {
                    throw new DomainError("No tienes permisos para editar este equipo.");
                }
            } else if (user.role !== 'SUPERADMIN') {
                throw new DomainError("Solo el SUPERADMIN o el dirigente dueño pueden editar equipos.");
            }
        }

        if (request.name) existingTeam.name = request.name;
        if (request.logo !== undefined) existingTeam.logo = request.logo;
        if (request.foundedYear !== undefined) existingTeam.foundedYear = request.foundedYear;
        if (request.championshipsWon !== undefined) existingTeam.championshipsWon = request.championshipsWon;
        if (request.categoryId !== undefined) existingTeam.categoryId = request.categoryId;
        if (request.tournamentId !== undefined) existingTeam.tournamentId = request.tournamentId;

        const updated = await this.teamRepository.update(existingTeam);

        return {
            id: updated.id,
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
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
            managerId: updated.managerId
        };
    }
}
