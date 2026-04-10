"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayersByTeamUseCase = void 0;
class GetPlayersByTeamUseCase {
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async execute(teamId, includePicture = false) {
        const players = await this.playerRepository.findByTeamId(teamId);
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
exports.GetPlayersByTeamUseCase = GetPlayersByTeamUseCase;
