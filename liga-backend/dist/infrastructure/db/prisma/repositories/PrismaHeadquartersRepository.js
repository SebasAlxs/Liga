"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHeadquartersRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const Headquarters_1 = require("../../../../domain/entities/Headquarters");
class PrismaHeadquartersRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async create(hq) {
        const created = await this.prisma.headquarters.create({
            data: {
                id: hq.id,
                name: hq.name,
                city: hq.city,
                address: hq.address,
                active: hq.active,
            },
        });
        return new Headquarters_1.Headquarters(created.id, created.name, created.city ?? undefined, created.address ?? undefined, created.active);
    }
    async findById(id) {
        const hq = await this.prisma.headquarters.findUnique({ where: { id } });
        if (!hq)
            return null;
        return new Headquarters_1.Headquarters(hq.id, hq.name, hq.city ?? undefined, hq.address ?? undefined, hq.active);
    }
    async findAll() {
        const hqs = await this.prisma.headquarters.findMany({ orderBy: { createdAt: 'desc' } });
        return hqs.map((hq) => new Headquarters_1.Headquarters(hq.id, hq.name, hq.city ?? undefined, hq.address ?? undefined, hq.active));
    }
    async update(hq) {
        const updated = await this.prisma.headquarters.update({
            where: { id: hq.id },
            data: {
                name: hq.name,
                city: hq.city,
                address: hq.address,
                active: hq.active,
            },
        });
        return new Headquarters_1.Headquarters(updated.id, updated.name, updated.city ?? undefined, updated.address ?? undefined, updated.active);
    }
    async delete(id) {
        await this.prisma.headquarters.delete({ where: { id } });
    }
}
exports.PrismaHeadquartersRepository = PrismaHeadquartersRepository;
