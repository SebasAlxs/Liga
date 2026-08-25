export class PlayerTeamHistory {
    constructor(
        public readonly id: string,
        public playerId: string,
        public teamId: string,
        public startDate: Date,
        public endDate?: Date,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
