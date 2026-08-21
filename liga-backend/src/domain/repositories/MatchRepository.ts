import { Match } from "../entities/Match";
import { PaginatedResult, PaginationParams } from "./Pagination";

export interface MatchRepository {
    create(match: Match): Promise<Match>;
    findById(id: string): Promise<Match | null>;
    findAll(pagination?: PaginationParams): Promise<PaginatedResult<Match>>;
    findFinishedByTeam(teamId: string): Promise<Match[]>;
    update(match: Match): Promise<Match>;
    delete(id: string): Promise<void>;
}
