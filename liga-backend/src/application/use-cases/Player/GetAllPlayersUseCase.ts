import { PlayerResponse } from "../../../adapters/http/dto/PlayerResponse";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";

export class GetAllPlayersUseCase {
    constructor(private playerRepository: PlayerRepository) { }

    async execute(includePicture: boolean = false): Promise<PlayerResponse[]> {
        const players = await this.playerRepository.findAll();
        return players.map(p => {
            return {
                _id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                number: p.number,
                teamId: p.teamId,
                dni: p.dni,
                birthDate: p.birthDate?.toISOString(),
                isLocal: p.isLocal,
                picture: (includePicture && p.picture) ? Buffer.from(p.picture).toString('base64') : undefined,
                createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: p.updatedAt?.toISOString() || new Date().toISOString()
            };
        });
    }
}
