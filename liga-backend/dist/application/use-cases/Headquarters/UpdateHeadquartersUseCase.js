"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHeadquartersUseCase = void 0;
class UpdateHeadquartersUseCase {
    constructor(hqRepository) {
        this.hqRepository = hqRepository;
    }
    async execute(id, request) {
        const existing = await this.hqRepository.findById(id);
        if (!existing) {
            throw new Error("Sede no encontrada");
        }
        if (request.name !== undefined)
            existing.name = request.name;
        if (request.city !== undefined)
            existing.city = request.city;
        if (request.address !== undefined)
            existing.address = request.address;
        if (request.active !== undefined)
            existing.active = request.active;
        const updated = await this.hqRepository.update(existing);
        return {
            id: updated.id,
            name: updated.name,
            city: updated.city,
            address: updated.address,
            active: updated.active,
        };
    }
}
exports.UpdateHeadquartersUseCase = UpdateHeadquartersUseCase;
