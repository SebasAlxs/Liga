export class LeagueRules {
    constructor(public readonly id: string,
        public maxForeignPlayersOnField: number,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date) { }
}
