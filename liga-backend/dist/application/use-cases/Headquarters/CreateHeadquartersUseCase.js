"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHeadquartersUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Headquarters_1 = require("../../../domain/entities/Headquarters");
class CreateHeadquartersUseCase {
    constructor(hqRepository) {
        this.hqRepository = hqRepository;
    }
    async execute(request) {
        const hq = new Headquarters_1.Headquarters(crypto_1.default.randomUUID(), request.name, request.city, request.address, request.active !== undefined ? request.active : true);
        const created = await this.hqRepository.create(hq);
        return {
            id: created.id,
            name: created.name,
            city: created.city,
            address: created.address,
            active: created.active,
        };
    }
}
exports.CreateHeadquartersUseCase = CreateHeadquartersUseCase;
