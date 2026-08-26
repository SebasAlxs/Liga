export enum StageType {
    LEAGUE = "LEAGUE",
    GROUP_STAGE = "GROUP_STAGE",
    KNOCKOUT = "KNOCKOUT"
}

export class Stage {
    constructor(
        public readonly id: string,
        public tournamentId: string,
        public name: string,
        public type: StageType,
        public order: number,
        public isTwoLegged: boolean = false,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
