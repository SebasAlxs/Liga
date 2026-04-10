"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTournamentRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const Tournament_1 = require("../../../../domain/entities/Tournament");
class PrismaTournamentRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async findAll() {
        const prismaTournaments = await this.prisma.tournament.findMany({
            orderBy: { createdAt: "desc" },
        });
        return prismaTournaments.map((t) => new Tournament_1.Tournament(t.id, t.name, t.headquartersId ?? undefined, t.maxYellowCardsForSuspension, t.active, t.createdAt, t.updatedAt));
    }
    async findById(id) {
        const t = await this.prisma.tournament.findUnique({ where: { id } });
        if (!t)
            return null;
        return new Tournament_1.Tournament(t.id, t.name, t.headquartersId ?? undefined, t.maxYellowCardsForSuspension, t.active, t.createdAt, t.updatedAt);
    }
    async save(tournament) {
        const t = await this.prisma.tournament.upsert({
            where: { id: tournament.id },
            update: {
                name: tournament.name,
                headquartersId: tournament.headquartersId,
                maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
                active: tournament.active,
            },
            create: {
                id: tournament.id,
                name: tournament.name,
                headquartersId: tournament.headquartersId,
                maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
                active: tournament.active,
            },
        });
        return new Tournament_1.Tournament(t.id, t.name, t.headquartersId ?? undefined, t.maxYellowCardsForSuspension, t.active, t.createdAt, t.updatedAt);
    }
    async update(tournament) {
        const t = await this.prisma.tournament.update({
            where: { id: tournament.id },
            data: {
                name: tournament.name,
                headquartersId: tournament.headquartersId,
                maxYellowCardsForSuspension: tournament.maxYellowCardsForSuspension,
                active: tournament.active,
            },
        });
        return new Tournament_1.Tournament(t.id, t.name, t.headquartersId ?? undefined, t.maxYellowCardsForSuspension, t.active, t.createdAt, t.updatedAt);
    }
    async delete(id) {
        await this.prisma.tournament.delete({ where: { id } });
    }
    async findActive() {
        const t = await this.prisma.tournament.findFirst({
            where: { active: true },
        });
        if (!t)
            return null;
        return new Tournament_1.Tournament(t.id, t.name, t.headquartersId ?? undefined, t.maxYellowCardsForSuspension, t.active, t.createdAt, t.updatedAt);
    }
}
exports.PrismaTournamentRepository = PrismaTournamentRepository;
