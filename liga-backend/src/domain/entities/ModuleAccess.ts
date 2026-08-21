export class ModuleAccess {
    constructor(
        public readonly id: string,
        public role: string,
        public module: string,
        public visible: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
