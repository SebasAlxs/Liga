import prisma from "../PrismaClient";
import { LeagueRules } from "../../../../domain/entities/LeagueRules";
import { LeagueRulesRepository, LeagueRulesUpdateInput } from "../../../../domain/repositories/LeagueRulesRepository";

export class PrismaLeagueRulesRepository implements LeagueRulesRepository {
    private prisma = prisma;

    private toEntity(r: any): LeagueRules {
        return new LeagueRules(r.id, r.maxForeignPlayersOnField, r.updatedAt);
    }

    // Singleton: siempre trabajamos sobre la primera fila; si no existe, se crea con los defaults.
    private async ensureRow() {
        const existing = await this.prisma.leagueRules.findFirst();
        if (existing) return existing;
        return this.prisma.leagueRules.create({ data: {} });
    }

    async get(): Promise<LeagueRules> {
        const row = await this.ensureRow();
        return this.toEntity(row);
    }

    async update(data: LeagueRulesUpdateInput): Promise<LeagueRules> {
        const row = await this.ensureRow();
        const updated = await this.prisma.leagueRules.update({
            where: { id: row.id },
            data,
        });
        return this.toEntity(updated);
    }
}
