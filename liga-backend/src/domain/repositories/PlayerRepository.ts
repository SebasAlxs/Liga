import { Player } from "../entities/Player";

export interface PlayerRepository {
    create(player: Player): Promise<Player>;
    findById(id: string): Promise<Player | null>;
    findByDni(dni: string): Promise<Player | null>;
    findAll(): Promise<Player[]>;
    update(player: Player): Promise<Player>;
    delete(id: string): Promise<void>;
    findByTeamId(teamId: string): Promise<Player[]>;
}
