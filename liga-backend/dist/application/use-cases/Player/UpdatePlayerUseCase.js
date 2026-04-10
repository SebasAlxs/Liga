"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlayerUseCase = void 0;
class UpdatePlayerUseCase {
    constructor(playerRepository, teamRepository, categoryRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
        this.categoryRepository = categoryRepository;
    }
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    async execute(id, request) {
        const existingPlayer = await this.playerRepository.findById(id);
        if (!existingPlayer) {
            throw new Error("Player not found");
        }
        if (request.firstName)
            existingPlayer.firstName = request.firstName;
        if (request.lastName)
            existingPlayer.lastName = request.lastName;
        if (request.number !== undefined)
            existingPlayer.number = request.number;
        // Validar DNI único si cambia
        if (request.dni && request.dni !== existingPlayer.dni) {
            const playerWithDni = await this.playerRepository.findByDni(request.dni);
            if (playerWithDni) {
                throw new Error(`Ya existe un jugador registrado con la cédula ${request.dni}`);
            }
            existingPlayer.dni = request.dni;
        }
        // Validar Edad si cambia fecha o equipo
        const newBirthDate = request.birthDate ? new Date(request.birthDate) : existingPlayer.birthDate;
        const newTeamId = request.teamId || existingPlayer.teamId;
        if (newBirthDate && (request.birthDate || request.teamId)) {
            const team = await this.teamRepository.findById(newTeamId);
            if (team && team.categoryId) {
                const category = await this.categoryRepository.findById(team.categoryId);
                if (category) {
                    const age = this.calculateAge(newBirthDate);
                    if (category.minAge && age < category.minAge) {
                        throw new Error(`El jugador no cumple con la edad mínima (${category.minAge} años) para la categoría ${category.name}. El jugador tiene ${age} años.`);
                    }
                    if (category.maxAge && age > category.maxAge) {
                        throw new Error(`El jugador supera la edad máxima (${category.maxAge} años) para la categoría ${category.name}. El jugador tiene ${age} años.`);
                    }
                }
            }
        }
        if (request.birthDate)
            existingPlayer.birthDate = new Date(request.birthDate);
        if (request.teamId)
            existingPlayer.teamId = request.teamId;
        if (request.isLocal !== undefined)
            existingPlayer.isLocal = request.isLocal;
        if (request.picture !== undefined) {
            existingPlayer.picture = request.picture ? Buffer.from(request.picture, 'base64') : undefined;
        }
        const updated = await this.playerRepository.update(existingPlayer);
        return {
            _id: updated.id,
            firstName: updated.firstName,
            lastName: updated.lastName,
            number: updated.number,
            teamId: updated.teamId,
            dni: updated.dni,
            birthDate: updated.birthDate?.toISOString(),
            isLocal: updated.isLocal,
            picture: updated.picture ? Buffer.from(updated.picture).toString('base64') : undefined,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString()
        };
    }
}
exports.UpdatePlayerUseCase = UpdatePlayerUseCase;
