import { SuspensionRepository } from "../../../domain/repositories/SuspensionRepository";

export class ServeTeamSuspensionsUseCase {
    constructor(private suspensionRepository: SuspensionRepository) { }

    async execute(teamId: string, tournamentId: string, finishedMatchId: string, finishedMatchDate: Date): Promise<void> {
        const activeSuspensions = await this.suspensionRepository.findActiveByTeamAndTournament(teamId, tournamentId);

        for (const suspension of activeSuspensions) {
            const issuedInThisMatch = suspension.matchId === finishedMatchId;
            const issuedBeforeThisMatch = !!suspension.createdAt && suspension.createdAt <= finishedMatchDate;

            if (!issuedInThisMatch && issuedBeforeThisMatch) {
                await this.suspensionRepository.updateStatus(suspension.id, "SERVED");
            }
        }
    }
}
