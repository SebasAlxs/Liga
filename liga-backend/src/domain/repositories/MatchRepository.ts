import { Match } from "../entities/Match";

export interface MatchRepository {
    create(match: Match): Promise<Match>;
    findById(id: string): Promise<Match | null>;
    findAll(): Promise<Match[]>;
    update(match: Match): Promise<Match>;
    delete(id: string): Promise<void>;
}
