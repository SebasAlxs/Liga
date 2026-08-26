import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { MatchResponse, UpdateMatchRequest } from "../../../adapters/http/dto/MatchResponse";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { RecalculateTeamStatsUseCase } from "../Stats/RecalculateTeamStatsUseCase";
import { ServeTeamSuspensionsUseCase } from "../Suspension/ServeTeamSuspensionsUseCase";

export class UpdateMatchUseCase {
    constructor(
        private matchRepository: MatchRepository,
        private teamStatsUseCase: RecalculateTeamStatsUseCase,
        private serveTeamSuspensionsUseCase?: ServeTeamSuspensionsUseCase
    ) { }

    async execute(id: string, request: UpdateMatchRequest): Promise<MatchResponse> {
        const existingMatch = await this.matchRepository.findById(id);
        if (!existingMatch) {
            throw new NotFoundError("Match not found");
        }

        if (request.homeTeamId) existingMatch.homeTeamId = request.homeTeamId;
        if (request.awayTeamId) existingMatch.awayTeamId = request.awayTeamId;
        if (request.homeScore !== undefined) existingMatch.homeScore = request.homeScore;
        if (request.awayScore !== undefined) existingMatch.awayScore = request.awayScore;
        if (request.matchDate) existingMatch.matchDate = new Date(request.matchDate);
        if (request.tournamentId) existingMatch.tournamentId = request.tournamentId;
        if (request.categoryId) existingMatch.categoryId = request.categoryId;
        if (request.status) existingMatch.status = request.status;
        if (request.stageId) existingMatch.stageId = request.stageId;
        
        if (request.firstHalfStartedAt !== undefined) existingMatch.firstHalfStartedAt = request.firstHalfStartedAt ? new Date(request.firstHalfStartedAt) : null;
        if (request.firstHalfEndedAt !== undefined) existingMatch.firstHalfEndedAt = request.firstHalfEndedAt ? new Date(request.firstHalfEndedAt) : null;
        if (request.secondHalfStartedAt !== undefined) existingMatch.secondHalfStartedAt = request.secondHalfStartedAt ? new Date(request.secondHalfStartedAt) : null;
        
        // Referee updates
        if (request.refereeId !== undefined) existingMatch.refereeId = request.refereeId;
        if (request.assistant1Id !== undefined) existingMatch.assistant1Id = request.assistant1Id;
        if (request.assistant2Id !== undefined) existingMatch.assistant2Id = request.assistant2Id;
        if (request.fourthRefereeId !== undefined) existingMatch.fourthRefereeId = request.fourthRefereeId;

        const updated = await this.matchRepository.update(existingMatch);

        if (updated.status === "FINISHED") {
            await this.teamStatsUseCase.execute(updated.homeTeamId);
            await this.teamStatsUseCase.execute(updated.awayTeamId);

            // Un equipo que termina un partido cumple, para sus sanciones activas emitidas
            // antes de este partido, un partido de suspensión (asume que los partidos se
            // finalizan en orden cronológico, vía el flujo real de "Finalizar Partido" en Vocalía).
            if (this.serveTeamSuspensionsUseCase) {
                await this.serveTeamSuspensionsUseCase.execute(updated.homeTeamId, updated.tournamentId, updated.id, updated.matchDate);
                await this.serveTeamSuspensionsUseCase.execute(updated.awayTeamId, updated.tournamentId, updated.id, updated.matchDate);
            }
        }

        return {
            _id: updated.id,
            homeTeamId: updated.homeTeamId,
            awayTeamId: updated.awayTeamId,
            homeScore: updated.homeScore,
            awayScore: updated.awayScore,
            matchDate: updated.matchDate.toISOString(),
            round: updated.round,
            tournamentId: updated.tournamentId,
            categoryId: updated.categoryId,
            status: updated.status,
            firstHalfStartedAt: updated.firstHalfStartedAt?.toISOString() || null,
            firstHalfEndedAt: updated.firstHalfEndedAt?.toISOString() || null,
            secondHalfStartedAt: updated.secondHalfStartedAt?.toISOString() || null,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
            refereeId: updated.refereeId,
            assistant1Id: updated.assistant1Id,
            assistant2Id: updated.assistant2Id,
            fourthRefereeId: updated.fourthRefereeId,
            primaryReferee: updated.primaryReferee,
            assistant1: updated.assistant1,
            assistant2: updated.assistant2,
            fourthReferee: updated.fourthReferee,
            stageId: updated.stageId,
            stage: updated.stage
        };
    }
}
