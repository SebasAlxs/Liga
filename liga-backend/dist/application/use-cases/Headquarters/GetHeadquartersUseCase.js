"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHeadquartersUseCase = void 0;
class GetHeadquartersUseCase {
    constructor(hqRepository) {
        this.hqRepository = hqRepository;
    }
    async execute() {
        const hqs = await this.hqRepository.findAll();
        return hqs.map((hq) => ({
            id: hq.id,
            name: hq.name,
            city: hq.city,
            address: hq.address,
            active: hq.active,
        }));
    }
}
exports.GetHeadquartersUseCase = GetHeadquartersUseCase;
