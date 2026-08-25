import crypto from "crypto";
import { Match, MatchStatus } from "../../../domain/entities/Match";
import { Team } from "../../../domain/entities/Team";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { DomainError } from "../../../domain/exceptions/DomainError";

export interface GenerateFixtureRequest {
    tournamentId: string;
    categoryId: string;
    doubleRound: boolean;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class GenerateFixtureUseCase {
    constructor(
        private matchRepository: MatchRepository,
        private teamRepository: TeamRepository
    ) { }

    async execute(request: GenerateFixtureRequest): Promise<Match[]> {
        const { tournamentId, categoryId, doubleRound } = request;

        const { items: teams } = await this.teamRepository.findAll(undefined, { tournamentId, categoryId });
        if (teams.length < 2) {
            throw new DomainError("Se necesitan al menos 2 equipos en el torneo y categoría para generar el fixture.");
        }

        const existing = await this.matchRepository.findByTournamentAndCategory(tournamentId, categoryId);
        if (existing.length > 0) {
            throw new DomainError("Ya existe un fixture generado para este torneo y categoría.");
        }

        const pairings = this.generateRoundRobinPairings(teams, doubleRound);

        const baseDate = new Date();
        const matches = pairings.map(({ round, home, away }) => {
            const matchDate = new Date(baseDate.getTime() + (round - 1) * MS_PER_DAY);
            return new Match(
                crypto.randomUUID(),
                home.id,
                away.id,
                null,
                null,
                matchDate,
                tournamentId,
                categoryId,
                MatchStatus.SCHEDULED,
                undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined,
                undefined, undefined, undefined,
                undefined, undefined,
                round
            );
        });

        return this.matchRepository.createMany(matches);
    }

    private generateRoundRobinPairings(teams: Team[], doubleRound: boolean): { round: number; home: Team; away: Team }[] {
        const arr: (Team | null)[] = [...teams];
        if (arr.length % 2 !== 0) {
            arr.push(null);
        }

        const n = arr.length;
        const totalRounds = n - 1;
        const half = n / 2;
        const pairings: { round: number; home: Team; away: Team }[] = [];

        let current = arr.slice();
        for (let round = 0; round < totalRounds; round++) {
            for (let i = 0; i < half; i++) {
                const t1 = current[i];
                const t2 = current[n - 1 - i];
                if (t1 && t2) {
                    const home = round % 2 === 0 ? t1 : t2;
                    const away = round % 2 === 0 ? t2 : t1;
                    pairings.push({ round: round + 1, home, away });
                }
            }
            const fixed = current[0];
            const rest = current.slice(1);
            rest.unshift(rest.pop()!);
            current = [fixed, ...rest];
        }

        if (doubleRound) {
            for (const p of pairings.slice()) {
                pairings.push({ round: totalRounds + p.round, home: p.away, away: p.home });
            }
        }

        return pairings;
    }
}
