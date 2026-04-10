import { SuspensionStatus } from "@prisma/client";
export { SuspensionStatus };

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
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.playerId || this.playerId.trim() === "") throw new Error("La suspensión requiere un playerId válido.");
        if (!this.tournamentId || this.tournamentId.trim() === "") throw new Error("La suspensión requiere un tournamentId válido.");
        if (!this.reason || this.reason.trim() === "") throw new Error("La razón de la suspensión es obligatoria.");
        if (this.matchesSuspended < 1) throw new Error("El número de partidos de suspensión debe ser al menos 1.");

        const validStatuses = ["ACTIVE", "SERVED", "APPEALED"];
        if (!validStatuses.includes(this.status)) {
            throw new Error(`Estado de suspensión inválido. Opciones: ${validStatuses.join(", ")}`);
        }
    }
}
