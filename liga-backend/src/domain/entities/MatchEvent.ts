import { DomainError } from "../exceptions/DomainError";
export type EventType = "YELLOW_CARD" | "RED_CARD" | "GOAL" | "ASSIST" | "SUBSTITUTION" | "PLAYER_ENTRY";

export class MatchEvent {
    constructor(
        public readonly id: string,
        public matchId: string,
        public playerId: string,
        public teamId: string,
        public type: EventType,
        public minute?: number,
        public relatedPlayerId?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.matchId || this.matchId.trim() === "") throw new DomainError("MatchEvent require un matchId válido.");
        if (!this.playerId || this.playerId.trim() === "") throw new DomainError("MatchEvent require un playerId válido.");
        if (!this.teamId || this.teamId.trim() === "") throw new DomainError("MatchEvent require un teamId válido.");

        const validTypes = ["YELLOW_CARD", "RED_CARD", "GOAL", "ASSIST", "SUBSTITUTION", "PLAYER_ENTRY"];
        if (!validTypes.includes(this.type)) {
            throw new DomainError(`Tipo de evento no válido. Opciones: ${validTypes.join(", ")}`);
        }

        if (this.minute !== undefined && this.minute < 0) {
            throw new DomainError("El minuto del evento no puede ser negativo.");
        }
    }
}
