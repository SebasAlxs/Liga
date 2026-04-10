"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
class PrismaUserRepository {
    constructor() {
        this.prisma = PrismaClient_1.default;
    }
    async findByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }
    async create(user) {
        return await PrismaClient_1.default.user.create({
            data: {
                email: user.email,
                password: user.password,
                role: user.role,
            },
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
