"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteHeadquartersUseCase = void 0;
class DeleteHeadquartersUseCase {
    constructor(hqRepository) {
        this.hqRepository = hqRepository;
    }
    async execute(id) {
        const existing = await this.hqRepository.findById(id);
        if (!existing) {
            throw new Error("Sede no encontrada");
        }
        await this.hqRepository.delete(id);
    }
}
exports.DeleteHeadquartersUseCase = DeleteHeadquartersUseCase;
