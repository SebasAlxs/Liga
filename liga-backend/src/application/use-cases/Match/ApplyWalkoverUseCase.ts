import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { FineRepository } from "../../../domain/repositories/FineRepository";
import { FineTypeRepository } from "../../../domain/repositories/FineTypeRepository";
import { RecalculateTeamStatsUseCase } from "../Stats/RecalculateTeamStatsUseCase";
import { MatchStatus } from "../../../domain/entities/Match";
import { DomainError } from "../../../domain/exceptions/DomainError";

export class ApplyWalkoverUseCase {
    constructor(
        private matchRepository: MatchRepository,
        private fineRepository: FineRepository,
        private fineTypeRepository: FineTypeRepository,
        private teamStatsUseCase: RecalculateTeamStatsUseCase
    ) { }

    /**
     * @param matchId ID of the match
     * @param teamAbsentId ID of the team that didn't show up
     */
    async execute(matchId: string, teamAbsentId: string): Promise<void> {
        const match = await this.matchRepository.findById(matchId);
        if (!match) throw new DomainError("Partido no encontrado.");
        if (match.status === "FINISHED") throw new DomainError("El partido ya está finalizado.");

        if (match.homeTeamId !== teamAbsentId && match.awayTeamId !== teamAbsentId) {
            throw new DomainError("El equipo ausente no pertenece a este partido.");
        }

        // Apply 3-0 score
        if (match.homeTeamId === teamAbsentId) {
            match.homeScore = 0;
            match.awayScore = 3;
        } else {
            match.homeScore = 3;
            match.awayScore = 0;
        }

        match.status = MatchStatus.FINISHED;
        
        // Finalize match
        await this.matchRepository.update(match);

        // Calculate stats
        await this.teamStatsUseCase.execute(match.homeTeamId);
        await this.teamStatsUseCase.execute(match.awayTeamId);

        // Apply Fine (No Presentación)
        const fineTypes = await this.fineTypeRepository.findAll({ active: true });
        // Search for a fine type that sounds like W.O.
        const fineType = fineTypes.find(t => 
            t.name.trim().toLowerCase() === "no presentación" || 
            t.name.trim().toLowerCase() === "w.o." ||
            t.name.trim().toLowerCase() === "w.o" ||
            t.name.trim().toLowerCase() === "wo"
        );

        if (fineType) {
            await this.fineRepository.create({
                amount: fineType.defaultAmount,
                reason: fineType.name,
                status: "PENDING",
                teamId: teamAbsentId,
                matchId: match.id
            });
        }
    }
}
