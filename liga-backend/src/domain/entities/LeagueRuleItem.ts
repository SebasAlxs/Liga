export class LeagueRuleItem {
    constructor(
        public readonly id: string,
        public title: string,
        public description?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.title || this.title.length < 2) {
            throw new Error("El título de la regla debe tener al menos 2 caracteres");
        }
    }
}
