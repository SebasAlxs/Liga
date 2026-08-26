import { Stage } from "../entities/Stage";

export interface StageRepository {
    create(stage: Stage): Promise<Stage>;
    update(stage: Stage): Promise<Stage>;
    delete(id: string): Promise<void>;
    findByTournament(tournamentId: string): Promise<Stage[]>;
    findById(id: string): Promise<Stage | null>;
}
