import { PlayerTeamHistoryRepository } from "../../../domain/repositories/PlayerTeamHistoryRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";

export interface PlayerTeamHistoryResponse {
    id: string;
    teamId: string;
    teamName: string;
    teamLogo?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
}

export class GetPlayerTeamHistoryUseCase {
    constructor(
        private teamHistoryRepository: PlayerTeamHistoryRepository,
        private teamRepository: TeamRepository
    ) { }

    async execute(playerId: string): Promise<PlayerTeamHistoryResponse[]> {
        const entries = await this.teamHistoryRepository.findByPlayer(playerId);
        const teamIds = [...new Set(entries.map(e => e.teamId))];
        const teams = await Promise.all(teamIds.map(id => this.teamRepository.findById(id)));
        const teamById = new Map(teams.filter((t): t is NonNullable<typeof t> => !!t).map(t => [t.id, t]));

        return entries.map(e => {
            const team = teamById.get(e.teamId);
            return {
                id: e.id,
                teamId: e.teamId,
                teamName: team ? team.name : "Equipo desconocido",
                teamLogo: team?.logo,
                startDate: e.startDate.toISOString(),
                endDate: e.endDate?.toISOString(),
                current: !e.endDate,
            };
        });
    }
}
