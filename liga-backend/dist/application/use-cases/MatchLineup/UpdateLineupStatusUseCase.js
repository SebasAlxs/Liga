"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLineupStatusUseCase = void 0;
class UpdateLineupStatusUseCase {
    constructor(lineupRepository) {
        this.lineupRepository = lineupRepository;
    }
    async execute(lineupId, status) {
        const item = await this.lineupRepository.findById(lineupId);
        if (!item) {
            throw new Error("Registro de nómina no encontrado.");
        }
        item.status = status;
        return await this.lineupRepository.update(item);
    }
}
exports.UpdateLineupStatusUseCase = UpdateLineupStatusUseCase;
