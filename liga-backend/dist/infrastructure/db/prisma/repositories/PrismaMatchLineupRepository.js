"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMatchLineupRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const MatchLineup_1 = require("../../../../domain/entities/MatchLineup");
class PrismaMatchLineupRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async create(lineup) {
        try {
            console.log("Creating MatchLineup with data:", lineup);
            const created = await this.prisma.matchLineup.create({
                data: {
                    id: lineup.id,
                    matchId: lineup.matchId,
                    playerId: lineup.playerId,
                    teamId: lineup.teamId,
                    status: lineup.status,
                    checkedIn: lineup.checkedIn,
                    number: lineup.number ?? undefined,
                },
            });
            return this.mapToEntity(created);
        }
        catch (error) {
            console.error("Prisma error creating MatchLineup:", error);
            throw error;
        }
    }
    async findById(id) {
        const item = await this.prisma.matchLineup.findUnique({ where: { id } });
        return item ? this.mapToEntity(item) : null;
    }
    async findByMatchAndPlayer(matchId, playerId) {
        const item = await this.prisma.matchLineup.findUnique({
            where: {
                matchId_playerId: { matchId, playerId }
            }
        });
        return item ? this.mapToEntity(item) : null;
    }
    async findByMatch(matchId) {
        const items = await this.prisma.matchLineup.findMany({
            where: { matchId }
        });
        return items.map(item => this.mapToEntity(item));
    }
    async update(lineup) {
        const updated = await this.prisma.matchLineup.update({
            where: { id: lineup.id },
            data: {
                status: lineup.status,
                checkedIn: lineup.checkedIn,
                number: lineup.number ?? undefined,
            },
        });
        return this.mapToEntity(updated);
    }
    async delete(id) {
        await this.prisma.matchLineup.delete({ where: { id } });
    }
    mapToEntity(data) {
        return new MatchLineup_1.MatchLineup(data.id, data.matchId, data.playerId, data.teamId, data.status, data.checkedIn, data.number);
    }
}
exports.PrismaMatchLineupRepository = PrismaMatchLineupRepository;
