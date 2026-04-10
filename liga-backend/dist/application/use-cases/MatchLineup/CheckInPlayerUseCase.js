"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInPlayerUseCase = void 0;
class CheckInPlayerUseCase {
    constructor(lineupRepository) {
        this.lineupRepository = lineupRepository;
    }
    async execute(lineupId, checkedIn) {
        const item = await this.lineupRepository.findById(lineupId);
        if (!item) {
            throw new Error("Registro de nómina no encontrado.");
        }
        item.checkedIn = checkedIn;
        return await this.lineupRepository.update(item);
    }
}
exports.CheckInPlayerUseCase = CheckInPlayerUseCase;
