import { Team } from "../entities/Team";

export interface TeamRepository {
    create(team: Team): Promise<Team>;
    findById(id: string): Promise<Team | null>;
    findByName(name: string): Promise<Team | null>;
    findAll(): Promise<Team[]>;
    getStandings(tournamentId: string): Promise<Team[]>;
    update(team: Team): Promise<Team>;
    delete(id: string): Promise<void>;
}
