"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSuspensionRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const Suspension_1 = require("../../../../domain/entities/Suspension");
class PrismaSuspensionRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async create(suspension) {
        const created = await this.prisma.suspension.create({
            data: {
                id: suspension.id,
                playerId: suspension.playerId,
                tournamentId: suspension.tournamentId,
                matchId: suspension.matchId,
                reason: suspension.reason,
                matchesSuspended: suspension.matchesSuspended,
                status: suspension.status,
            },
        });
        return new Suspension_1.Suspension(created.id, created.playerId, created.tournamentId, created.reason, created.matchesSuspended, created.status, created.matchId ?? undefined, created.createdAt, created.updatedAt);
    }
    async findByPlayerInTournament(playerId, tournamentId) {
        const suspensions = await this.prisma.suspension.findMany({
            where: { playerId, tournamentId },
            orderBy: { createdAt: 'desc' },
        });
        return suspensions.map(s => new Suspension_1.Suspension(s.id, s.playerId, s.tournamentId, s.reason, s.matchesSuspended, s.status, s.matchId ?? undefined, s.createdAt, s.updatedAt));
    }
    async updateStatus(id, status) {
        const updated = await this.prisma.suspension.update({
            where: { id },
            data: { status },
        });
        return new Suspension_1.Suspension(updated.id, updated.playerId, updated.tournamentId, updated.reason, updated.matchesSuspended, updated.status, updated.matchId ?? undefined, updated.createdAt, updated.updatedAt);
    }
    async delete(id) {
        await this.prisma.suspension.delete({ where: { id } });
    }
    async deleteByMatch(matchId, playerId) {
        await this.prisma.suspension.deleteMany({
            where: {
                matchId,
                playerId
            }
        });
    }
}
exports.PrismaSuspensionRepository = PrismaSuspensionRepository;
