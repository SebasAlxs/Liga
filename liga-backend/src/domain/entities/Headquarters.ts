export class Headquarters {
    constructor(
        public id: string,
        public name: string,
        public city?: string,
        public address?: string,
        public active: boolean = true
    ) {
        this.validate();
    }

    private validate() {
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
