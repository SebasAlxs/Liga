"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Headquarters = void 0;
class Headquarters {
    constructor(id, name, city, address, active = true) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.address = address;
        this.active = active;
        this.validate();
    }
    validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("El nombre de la Sede es requerido.");
        }
        if (this.city !== undefined && this.city.trim().length === 0) {
            throw new Error("La ciudad no puede estar vacía si se proporciona.");
        }
        if (this.address !== undefined && this.address.trim().length === 0) {
            throw new Error("La dirección no puede estar vacía si se proporciona.");
        }
    }
}
exports.Headquarters = Headquarters;
