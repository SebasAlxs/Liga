import { LeagueRulesResponse, UpdateLeagueRulesRequest } from "../../../adapters/http/dto/LeagueRulesResponse";
import { LeagueRulesRepository } from "../../../domain/repositories/LeagueRulesRepository";

export class UpdateLeagueRulesUseCase {
    constructor(private leagueRulesRepository: LeagueRulesRepository) { }

    async execute(request: UpdateLeagueRulesRequest): Promise<LeagueRulesResponse> {
        if (request.maxForeignPlayersOnField !== undefined && request.maxForeignPlayersOnField < 0) {
            throw new Error("El máximo de foráneos en cancha no puede ser negativo.");
        }

        const r = await this.leagueRulesRepository.update(request);
        return {
            _id: r.id,
            maxForeignPlayersOnField: r.maxForeignPlayersOnField,
        };
    }
}
