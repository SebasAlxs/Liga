import prisma from "../PrismaClient";
import { RuleItem } from "../../../../domain/entities/RuleItem";
import { RuleItemRepository } from "../../../../domain/repositories/RuleItemRepository";

export class PrismaRuleItemRepository implements RuleItemRepository {
    private prisma = prisma;

    async create(ruleItem: RuleItem): Promise<RuleItem> {
        const created = await this.prisma.ruleItem.create({
            data: {
                id: ruleItem.id,
                tournamentId: ruleItem.tournamentId,
                title: ruleItem.title,
                description: ruleItem.description,
            }
        });
        return new RuleItem(created.id, created.tournamentId, created.title, created.description, created.createdAt, created.updatedAt);
    }

    async update(ruleItem: RuleItem): Promise<RuleItem> {
        const updated = await this.prisma.ruleItem.update({
            where: { id: ruleItem.id },
            data: {
                title: ruleItem.title,
                description: ruleItem.description,
            }
        });
        return new RuleItem(updated.id, updated.tournamentId, updated.title, updated.description, updated.createdAt, updated.updatedAt);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.ruleItem.delete({ where: { id } });
    }

    async findByTournament(tournamentId: string): Promise<RuleItem[]> {
        const items = await this.prisma.ruleItem.findMany({
            where: { tournamentId },
            orderBy: { createdAt: "asc" }
        });
        return items.map(i => new RuleItem(i.id, i.tournamentId, i.title, i.description, i.createdAt, i.updatedAt));
    }

    async findById(id: string): Promise<RuleItem | null> {
        const i = await this.prisma.ruleItem.findUnique({ where: { id } });
        if (!i) return null;
        return new RuleItem(i.id, i.tournamentId, i.title, i.description, i.createdAt, i.updatedAt);
    }
}
