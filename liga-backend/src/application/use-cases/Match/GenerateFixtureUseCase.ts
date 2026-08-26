import crypto from "crypto";
import { Match, MatchStatus } from "../../../domain/entities/Match";
import { Team } from "../../../domain/entities/Team";
import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { StageRepository } from "../../../domain/repositories/StageRepository";
import { DomainError } from "../../../domain/exceptions/DomainError";
import { StageType } from "../../../domain/entities/Stage";

export interface GenerateFixtureRequest {
    tournamentId: string;
    categoryId: string;
    stageId: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class GenerateFixtureUseCase {
    constructor(
        private matchRepository: MatchRepository,
        private teamRepository: TeamRepository,
        private stageRepository: StageRepository
    ) { }

    async execute(request: GenerateFixtureRequest): Promise<Match[]> {
        const { tournamentId, categoryId, stageId } = request;

        const stage = await this.stageRepository.findById(stageId);
        if (!stage) {
            throw new DomainError("Stage no encontrada.");
        }

        const { items: teams } = await this.teamRepository.findAll(undefined, { tournamentId, categoryId });
        if (teams.length < 2) {
            throw new DomainError("Se necesitan al menos 2 equipos en el torneo y categoría para generar el fixture.");
        }

        // Si es una liga todos contra todos, validamos si ya hay un fixture generado para este stage y categoria
        // Por simplificar, si ya hay partidos en este stage y categoria, abortar
        const existing = await this.matchRepository.findByTournamentAndCategory(tournamentId, categoryId);
        if (existing.some(m => m.stageId === stageId)) {
            throw new DomainError("Ya existe un fixture generado para esta fase y categoría.");
        }

        let pairings: { round: number; home: Team; away: Team }[] = [];

        if (stage.type === StageType.LEAGUE || stage.type === StageType.GROUP_STAGE) {
            pairings = this.generateRoundRobinPairings(teams, stage.isTwoLegged);
        } else if (stage.type === StageType.KNOCKOUT) {
            // Un generador simple para Knockout (Empareja el 1 vs N, 2 vs N-1) o aleatorio.
            // Para mantener compatibilidad con lo anterior, lo emparejaremos de forma simple
            pairings = this.generateKnockoutPairings(teams, stage.isTwoLegged);
        }

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
                round,
                stage.id
            );
        });

        return this.matchRepository.createMany(matches);
    }

    private generateKnockoutPairings(teams: Team[], doubleRound: boolean): { round: number; home: Team; away: Team }[] {
        const pairings: { round: number; home: Team; away: Team }[] = [];
        const n = teams.length;
        const half = Math.floor(n / 2);
        
        for (let i = 0; i < half; i++) {
            const home = teams[i];
            const away = teams[n - 1 - i];
            pairings.push({ round: 1, home, away });
        }

        if (doubleRound) {
            const currentPairings = [...pairings];
            for (const p of currentPairings) {
                pairings.push({ round: 2, home: p.away, away: p.home });
            }
        }

        return pairings;
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
