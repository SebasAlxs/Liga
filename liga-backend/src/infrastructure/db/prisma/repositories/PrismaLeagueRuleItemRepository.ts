import prisma from "../PrismaClient";
import { LeagueRuleItem } from "../../../../domain/entities/LeagueRuleItem";
import { LeagueRuleItemRepository } from "../../../../domain/repositories/LeagueRuleItemRepository";

export class PrismaLeagueRuleItemRepository implements LeagueRuleItemRepository {
    private prisma = prisma;
    constructor() { }

    async findAll(): Promise<LeagueRuleItem[]> {
        const rows = await this.prisma.leagueRuleItem.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(
            (r) => new LeagueRuleItem(r.id, r.title, r.description ?? undefined, r.createdAt, r.updatedAt)
        );
    }

    async findById(id: string): Promise<LeagueRuleItem | null> {
        const r = await this.prisma.leagueRuleItem.findUnique({ where: { id } });
        if (!r) return null;
        return new LeagueRuleItem(r.id, r.title, r.description ?? undefined, r.createdAt, r.updatedAt);
    }

    async save(item: LeagueRuleItem): Promise<LeagueRuleItem> {
        const r = await this.prisma.leagueRuleItem.create({
            data: {
                id: item.id,
                title: item.title,
                description: item.description,
            },
        });
        return new LeagueRuleItem(r.id, r.title, r.description ?? undefined, r.createdAt, r.updatedAt);
    }

    async update(item: LeagueRuleItem): Promise<LeagueRuleItem> {
        const r = await this.prisma.leagueRuleItem.update({
            where: { id: item.id },
            data: {
                title: item.title,
                description: item.description,
            },
        });
        return new LeagueRuleItem(r.id, r.title, r.description ?? undefined, r.createdAt, r.updatedAt);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.leagueRuleItem.delete({ where: { id } });
    }
}
