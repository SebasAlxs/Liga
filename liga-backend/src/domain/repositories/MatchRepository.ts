import { Match } from "../entities/Match";
import { PaginatedResult, PaginationParams } from "./Pagination";

export interface MatchRepository {
    create(match: Match): Promise<Match>;
    createMany(matches: Match[]): Promise<Match[]>;
    findById(id: string): Promise<Match | null>;
    findAll(pagination?: PaginationParams, filters?: { managerId?: string }): Promise<PaginatedResult<Match>>;
    findFinishedByTeam(teamId: string): Promise<Match[]>;
    findByTournamentAndCategory(tournamentId: string, categoryId: string, stageId?: string): Promise<Match[]>;
    update(match: Match): Promise<Match>;
    delete(id: string): Promise<void>;
}
// trigger recompile
