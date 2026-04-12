export enum MatchStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
    CANCELLED = "CANCELLED"
}

export class Match {
    constructor(
        public readonly id: string,
        public homeTeamId: string,
        public awayTeamId: string,
        public homeScore: number | null,
        public awayScore: number | null,
        public matchDate: Date,
        public tournamentId: string,
        public categoryId: string,
        public status: MatchStatus = MatchStatus.SCHEDULED,
        public refereeId?: string | null,
        public assistant1Id?: string | null,
        public assistant2Id?: string | null,
        public fourthRefereeId?: string | null,
        public primaryReferee?: any,
        public assistant1?: any,
        public assistant2?: any,
        public fourthReferee?: any,
        public firstHalfStartedAt?: Date | null,
        public firstHalfEndedAt?: Date | null,
        public secondHalfStartedAt?: Date | null
    ) {
        this.validate();
    }

    private validate() {
        if (this.homeTeamId === this.awayTeamId) {
            throw new Error("A team cannot play against itself");
        }
        if ((this.homeScore !== null && this.homeScore < 0) || (this.awayScore !== null && this.awayScore < 0)) {
            throw new Error("Scores cannot be negative");
        }
    }
}
