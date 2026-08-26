import { DomainError } from "../exceptions/DomainError";
export type SuspensionStatus = "ACTIVE" | "SERVED" | "APPEALED";

export class Suspension {
    constructor(
        public readonly id: string,
        public playerId: string,
        public tournamentId: string,
        public reason: string,
        public matchesSuspended: number = 1,
        public status: SuspensionStatus = "ACTIVE",
        public matchId?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public teamId?: string,
        public fineId?: string,
        public servedMatches: number = 0
    ) {
        this.validate();
    }

    private validate() {
        if (!this.playerId || this.playerId.trim() === "") throw new DomainError("La suspensión requiere un playerId válido.");
        if (!this.tournamentId || this.tournamentId.trim() === "") throw new DomainError("La suspensión requiere un tournamentId válido.");
        if (!this.reason || this.reason.trim() === "") throw new DomainError("La razón de la suspensión es obligatoria.");
        if (this.matchesSuspended < 1) throw new DomainError("El número de partidos de suspensión debe ser al menos 1.");
        if (this.servedMatches < 0) throw new DomainError("Los partidos cumplidos no pueden ser negativos.");

        const validStatuses = ["ACTIVE", "SERVED", "APPEALED"];
        if (!validStatuses.includes(this.status)) {
            throw new DomainError(`Estado de suspensión inválido. Opciones: ${validStatuses.join(", ")}`);
        }
    }
}
