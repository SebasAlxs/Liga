"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchEvent = exports.EventType = void 0;
const client_1 = require("@prisma/client");
exports.EventType = client_1.EventType;
class MatchEvent {
    constructor(id, matchId, playerId, teamId, type, minute, relatedPlayerId, createdAt, updatedAt) {
        this.id = id;
        this.matchId = matchId;
        this.playerId = playerId;
        this.teamId = teamId;
        this.type = type;
        this.minute = minute;
        this.relatedPlayerId = relatedPlayerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }
    validate() {
        if (!this.matchId || this.matchId.trim() === "")
            throw new Error("MatchEvent require un matchId válido.");
        if (!this.playerId || this.playerId.trim() === "")
            throw new Error("MatchEvent require un playerId válido.");
        if (!this.teamId || this.teamId.trim() === "")
            throw new Error("MatchEvent require un teamId válido.");
        const validTypes = ["YELLOW_CARD", "RED_CARD", "GOAL", "ASSIST", "SUBSTITUTION"];
        if (!validTypes.includes(this.type)) {
            throw new Error(`Tipo de evento no válido. Opciones: ${validTypes.join(", ")}`);
        }
        if (this.minute !== undefined && this.minute < 0) {
            throw new Error("El minuto del evento no puede ser negativo.");
        }
    }
}
exports.MatchEvent = MatchEvent;
