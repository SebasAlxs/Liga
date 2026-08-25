import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { DomainError } from "../../../domain/exceptions/DomainError";
import { PlayerResponse, UpdatePlayerRequest } from "../../../adapters/http/dto/PlayerResponse";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { PlayerTeamHistoryRepository } from "../../../domain/repositories/PlayerTeamHistoryRepository";

export class UpdatePlayerUseCase {
    constructor(
        private playerRepository: PlayerRepository,
        private teamRepository: TeamRepository,
        private categoryRepository: CategoryRepository,
        private teamHistoryRepository: PlayerTeamHistoryRepository
    ) { }

    private calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    async execute(id: string, request: UpdatePlayerRequest): Promise<PlayerResponse> {
        const existingPlayer = await this.playerRepository.findById(id);
        if (!existingPlayer) {
            throw new NotFoundError("Player not found");
        }

        if (request.firstName) existingPlayer.firstName = request.firstName;
        if (request.lastName) existingPlayer.lastName = request.lastName;
        if (request.number !== undefined) existingPlayer.number = request.number;

        // Validar DNI único si cambia
        if (request.dni && request.dni !== existingPlayer.dni) {
            const playerWithDni = await this.playerRepository.findByDni(request.dni);
            if (playerWithDni) {
                throw new DomainError(`Ya existe un jugador registrado con la cédula ${request.dni}`);
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
                        throw new DomainError(`El jugador no cumple con la edad mínima (${category.minAge} años) para la categoría ${category.name}. El jugador tiene ${age} años.`);
                    }
                    if (category.maxAge && age > category.maxAge) {
                        throw new DomainError(`El jugador supera la edad máxima (${category.maxAge} años) para la categoría ${category.name}. El jugador tiene ${age} años.`);
                    }
                }
            }
        }

        const previousTeamId = existingPlayer.teamId;
        const teamChanged = !!request.teamId && request.teamId !== previousTeamId;

        if (request.birthDate) existingPlayer.birthDate = new Date(request.birthDate);
        if (request.teamId) existingPlayer.teamId = request.teamId;
        if (request.isLocal !== undefined) existingPlayer.isLocal = request.isLocal;

        if (request.picture !== undefined) {
            existingPlayer.picture = request.picture || undefined;
        }

        const updated = await this.playerRepository.update(existingPlayer);

        if (teamChanged) {
            const now = new Date();
            await this.teamHistoryRepository.closeOpenEntry(updated.id, now);
            await this.teamHistoryRepository.create(updated.id, updated.teamId, now);
        }

        return {
            _id: updated.id,
            firstName: updated.firstName,
            lastName: updated.lastName,
            number: updated.number,
            teamId: updated.teamId,
            dni: updated.dni,
            birthDate: updated.birthDate?.toISOString(),
            isLocal: updated.isLocal,
            picture: updated.picture || undefined,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString()
        };
    }
}
