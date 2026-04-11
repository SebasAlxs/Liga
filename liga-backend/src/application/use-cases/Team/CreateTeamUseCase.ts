import crypto from "crypto";
import { TeamResponse, CreateTeamRequest } from "../../../adapters/http/dto/TeamResponse";
import { Team } from "../../../domain/entities/Team";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export class CreateTeamUseCase {
    constructor(private teamRepository: TeamRepository) { }

    async execute(request: CreateTeamRequest): Promise<TeamResponse> {
        const team = new Team(
            crypto.randomUUID(),
            request.name,
            request.logo || "",
            request.foundedYear,
            request.championshipsWon,
            request.categoryId,
            request.tournamentId
        );

        const created = await this.teamRepository.create(team);

        return {
            id: created.id,
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
