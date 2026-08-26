export class RuleItem {
    constructor(
        public readonly id: string,
        public tournamentId: string,
        public title: string,
        public description?: string | null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
