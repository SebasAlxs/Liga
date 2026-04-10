import { EventType as PrismaEventType } from "@prisma/client";
export type EventType = PrismaEventType;
export const EventType = PrismaEventType;

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
        if (!this.matchId || this.matchId.trim() === "") throw new Error("MatchEvent require un matchId válido.");
        if (!this.playerId || this.playerId.trim() === "") throw new Error("MatchEvent require un playerId válido.");
        if (!this.teamId || this.teamId.trim() === "") throw new Error("MatchEvent require un teamId válido.");

        const validTypes = ["YELLOW_CARD", "RED_CARD", "GOAL", "ASSIST", "SUBSTITUTION"];
        if (!validTypes.includes(this.type)) {
            throw new Error(`Tipo de evento no válido. Opciones: ${validTypes.join(", ")}`);
        }

        if (this.minute !== undefined && this.minute < 0) {
            throw new Error("El minuto del evento no puede ser negativo.");
        }
    }
}
