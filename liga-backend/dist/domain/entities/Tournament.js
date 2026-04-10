"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tournament = void 0;
class Tournament {
    constructor(id, name, headquartersId, maxYellowCardsForSuspension = 3, active = true, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.headquartersId = headquartersId;
        this.maxYellowCardsForSuspension = maxYellowCardsForSuspension;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }
    validate() {
        if (!this.name || this.name.length < 3) {
            throw new Error("Tournament name must be at least 3 characters long");
        }
    }
}
exports.Tournament = Tournament;
