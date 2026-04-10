export enum LineupStatus {
    STARTER = "STARTER",
    SUBSTITUTE = "SUBSTITUTE"
}

export class MatchLineup {
    constructor(
        public readonly id: string,
        public readonly matchId: string,
        public readonly playerId: string,
        public readonly teamId: string,
        public status: LineupStatus = LineupStatus.SUBSTITUTE,
        public checkedIn: boolean = false,
        public number?: number | null
    ) { }
}
