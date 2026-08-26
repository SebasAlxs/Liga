import { DomainError } from "../exceptions/DomainError";
export class Tournament {
    constructor(
        public readonly id: string,
        public name: string,
        public maxYellowCardsForSuspension: number = 3,
        public active: boolean = true,
        public blockPlayerWithPendingFines: boolean = false,
        public maxForeignPlayersOnField: number = 4,
        public maxPlayersOnField: number = 11,
        public minPlayersToStartMatch: number = 7,
        public matchHalfDurationMinutes: number = 45,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public headquartersId?: string
    ) {
        this.validate();
    }

    private validate() {
        if (!this.name || this.name.length < 3) {
            throw new DomainError("Tournament name must be at least 3 characters long");
        }
    }
}
