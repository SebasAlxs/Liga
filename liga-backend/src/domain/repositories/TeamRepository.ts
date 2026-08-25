import { Team } from "../entities/Team";
import { PaginatedResult, PaginationParams } from "./Pagination";

export interface TeamRepository {
    create(team: Team): Promise<Team>;
    findById(id: string): Promise<Team | null>;
    findByName(name: string): Promise<Team | null>;
    findAll(pagination?: PaginationParams, filters?: { managerId?: string; tournamentId?: string; categoryId?: string }): Promise<PaginatedResult<Team>>;
    getStandings(tournamentId: string): Promise<Team[]>;
    update(team: Team): Promise<Team>;
    delete(id: string): Promise<void>;
}
