export class Category {
    constructor(
        public readonly id: string,
        public name: string,
        public minAge?: number,
        public maxAge?: number,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.name || this.name.length < 2) {
            throw new Error("Category name must be at least 2 characters long");
        }
    }
}
