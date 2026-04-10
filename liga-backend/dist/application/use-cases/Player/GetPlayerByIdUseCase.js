"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayerByIdUseCase = void 0;
class GetPlayerByIdUseCase {
    constructor(playerRepository, eventRepository) {
        this.playerRepository = playerRepository;
        this.eventRepository = eventRepository;
    }
    async execute(id) {
        const player = await this.playerRepository.findById(id);
        if (!player)
            return null;
        const stats = await this.eventRepository.getPlayerStats(id);
        return {
            _id: player.id,
            firstName: player.firstName,
            lastName: player.lastName,
            number: player.number,
            teamId: player.teamId,
            dni: player.dni,
            birthDate: player.birthDate?.toISOString(),
            isLocal: player.isLocal,
            picture: player.picture ? Buffer.from(player.picture).toString('base64') : undefined,
            stats,
            createdAt: player.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: player.updatedAt?.toISOString() || new Date().toISOString()
        };
    }
}
exports.GetPlayerByIdUseCase = GetPlayerByIdUseCase;
