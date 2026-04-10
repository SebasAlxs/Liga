import { Tournament } from "../entities/Tournament";

export interface TournamentRepository {
    findAll(): Promise<Tournament[]>;
    findById(id: string): Promise<Tournament | null>;
    save(tournament: Tournament): Promise<Tournament>;
    update(tournament: Tournament): Promise<Tournament>;
    delete(id: string): Promise<void>;
    findActive(): Promise<Tournament | null>;
}
