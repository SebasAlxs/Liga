"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlayerUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Player_1 = require("../../../domain/entities/Player");
class CreatePlayerUseCase {
    constructor(playerRepository, teamRepository, categoryRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
        this.categoryRepository = categoryRepository;
    }
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    async execute(request) {
        // 1. Validar DNI único
        if (request.dni) {
            const existingPlayer = await this.playerRepository.findByDni(request.dni);
            if (existingPlayer) {
                throw new Error(`Ya existe un jugador registrado con la cédula ${request.dni}`);
            }
        }
        // 2. Validar Edad según Categoría
        if (request.birthDate) {
            const team = await this.teamRepository.findById(request.teamId);
            if (team && team.categoryId) {
                const category = await this.categoryRepository.findById(team.categoryId);
                if (category) {
                    const birthDate = new Date(request.birthDate);
                    const age = this.calculateAge(birthDate);
                    if (category.minAge && age < category.minAge) {
                        throw new Error(`El jugador no cumple con la edad mínima (${category.minAge} años) para la categoría ${category.name}. El jugador tiene ${age} años.`);
                    }
                    if (category.maxAge && age > category.maxAge) {
                        throw new Error(`El jugador supera la edad máxima (${category.maxAge} años) para la categoría ${category.name}. El jugador tiene ${age} años.`);
                    }
                }
            }
        }
        const player = new Player_1.Player(crypto_1.default.randomUUID(), request.firstName, request.lastName, request.number, request.teamId, request.dni, request.birthDate ? new Date(request.birthDate) : undefined, request.isLocal, request.picture ? Buffer.from(request.picture, 'base64') : undefined);
        const created = await this.playerRepository.create(player);
        return {
            _id: created.id,
            firstName: created.firstName,
            lastName: created.lastName,
            number: created.number,
            teamId: created.teamId,
            dni: created.dni,
            birthDate: created.birthDate?.toISOString(),
            isLocal: created.isLocal,
            picture: created.picture ? Buffer.from(created.picture).toString('base64') : undefined,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString()
        };
    }
}
exports.CreatePlayerUseCase = CreatePlayerUseCase;
