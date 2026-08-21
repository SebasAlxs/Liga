import { LeagueRulesResponse } from "../../../adapters/http/dto/LeagueRulesResponse";
import { LeagueRulesRepository } from "../../../domain/repositories/LeagueRulesRepository";

export class GetLeagueRulesUseCase {
    constructor(private leagueRulesRepository: LeagueRulesRepository) { }

    async execute(): Promise<LeagueRulesResponse> {
        const r = await this.leagueRulesRepository.get();
        return {
            _id: r.id,
            maxForeignPlayersOnField: r.maxForeignPlayersOnField,
        };
    }
}
