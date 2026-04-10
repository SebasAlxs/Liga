"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPlayerRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const Player_1 = require("../../../../domain/entities/Player");
class PrismaPlayerRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async create(player) {
        const created = await this.prisma.player.create({
            data: {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                number: player.number,
                teamId: player.teamId,
                dni: player.dni,
                birthDate: player.birthDate,
                isLocal: player.isLocal,
                picture: player.picture ? Buffer.from(player.picture) : null,
            },
        });
        return new Player_1.Player(created.id, created.firstName, created.lastName, created.number, created.teamId, created.dni ?? undefined, created.birthDate ?? undefined, created.isLocal, created.picture ? Buffer.from(created.picture) : undefined, created.createdAt, created.updatedAt);
    }
    async findByDni(dni) {
        const p = await this.prisma.player.findUnique({ where: { dni } });
        if (!p)
            return null;
        return new Player_1.Player(p.id, p.firstName, p.lastName, p.number, p.teamId, p.dni ?? undefined, p.birthDate ?? undefined, p.isLocal, p.picture ? Buffer.from(p.picture) : undefined, p.createdAt, p.updatedAt);
    }
    async findById(id) {
        const player = await this.prisma.player.findUnique({ where: { id } });
        if (!player)
            return null;
        return new Player_1.Player(player.id, player.firstName, player.lastName, player.number, player.teamId, player.dni ?? undefined, player.birthDate ?? undefined, player.isLocal, player.picture ? Buffer.from(player.picture) : undefined, player.createdAt, player.updatedAt);
    }
    async findAll() {
        const players = await this.prisma.player.findMany();
        return players.map((p) => new Player_1.Player(p.id, p.firstName, p.lastName, p.number, p.teamId, p.dni ?? undefined, p.birthDate ?? undefined, p.isLocal, p.picture ? Buffer.from(p.picture) : undefined, p.createdAt, p.updatedAt));
    }
    async update(player) {
        const updated = await this.prisma.player.update({
            where: { id: player.id },
            data: {
                firstName: player.firstName,
                lastName: player.lastName,
                number: player.number,
                teamId: player.teamId,
                dni: player.dni,
                birthDate: player.birthDate,
                isLocal: player.isLocal,
                picture: player.picture ? Buffer.from(player.picture) : null,
            },
        });
        return new Player_1.Player(updated.id, updated.firstName, updated.lastName, updated.number, updated.teamId, updated.dni ?? undefined, updated.birthDate ?? undefined, updated.isLocal, updated.picture ? Buffer.from(updated.picture) : undefined, updated.createdAt, updated.updatedAt);
    }
    async delete(id) {
        await this.prisma.player.delete({ where: { id } });
    }
    async findByTeamId(teamId) {
        const players = await this.prisma.player.findMany({ where: { teamId } });
        return players.map((p) => new Player_1.Player(p.id, p.firstName, p.lastName, p.number, p.teamId, p.dni ?? undefined, p.birthDate ?? undefined, p.isLocal, p.picture ? Buffer.from(p.picture) : undefined, p.createdAt, p.updatedAt));
    }
}
exports.PrismaPlayerRepository = PrismaPlayerRepository;
