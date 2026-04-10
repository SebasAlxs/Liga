"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(id, firstName, lastName, number, teamId, dni, birthDate, isLocal = true, picture, createdAt, updatedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.number = number;
        this.teamId = teamId;
        this.dni = dni;
        this.birthDate = birthDate;
        this.isLocal = isLocal;
        this.picture = picture;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate();
    }
    validate() {
        if (!this.firstName || this.firstName.length < 2) {
            throw new Error("First name must be at least 2 characters long");
        }
        if (!this.lastName || this.lastName.length < 2) {
            throw new Error("Last name must be at least 2 characters long");
        }
    }
}
exports.Player = Player;
