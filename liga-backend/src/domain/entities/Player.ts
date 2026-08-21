export class Player {
    constructor(
        public readonly id: string,
        public firstName: string,
        public lastName: string,
        public number: number,
        public teamId: string,
        public dni?: string,
        public birthDate?: Date,
        public isLocal: boolean = true,
        public picture?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.firstName || this.firstName.length < 2) {
            throw new Error("First name must be at least 2 characters long");
        }
        if (!this.lastName || this.lastName.length < 2) {
            throw new Error("Last name must be at least 2 characters long");
        }
    }
}
