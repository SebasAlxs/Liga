"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suspension = exports.SuspensionStatus = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "SuspensionStatus", { enumerable: true, get: function () { return client_1.SuspensionStatus; } });
class Suspension {
    constructor(id, playerId, tournamentId, reason, matchesSuspended = 1, status = "ACTIVE", matchId, createdAt, updatedAt) {
        this.id = id;
        this.playerId = playerId;
        this.tournamentId = tournamentId;
        this.reason = reason;
        this.matchesSuspended = matchesSuspended;
        this.status = status;
        this.matchId = matchId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }
    validate() {
        if (!this.playerId || this.playerId.trim() === "")
            throw new Error("La suspensión requiere un playerId válido.");
        if (!this.tournamentId || this.tournamentId.trim() === "")
            throw new Error("La suspensión requiere un tournamentId válido.");
        if (!this.reason || this.reason.trim() === "")
            throw new Error("La razón de la suspensión es obligatoria.");
        if (this.matchesSuspended < 1)
            throw new Error("El número de partidos de suspensión debe ser al menos 1.");
        const validStatuses = ["ACTIVE", "SERVED", "APPEALED"];
        if (!validStatuses.includes(this.status)) {
            throw new Error(`Estado de suspensión inválido. Opciones: ${validStatuses.join(", ")}`);
        }
    }
}
exports.Suspension = Suspension;
