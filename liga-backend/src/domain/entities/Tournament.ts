import { DomainError } from "../exceptions/DomainError";
export class Tournament {
    constructor(
        public readonly id: string,
        public name: string,
        public headquartersId?: string,
        public maxYellowCardsForSuspension: number = 3,
        public active: boolean = true,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.name || this.name.length < 3) {
            throw new DomainError("Tournament name must be at least 3 characters long");
        }
    }
}
