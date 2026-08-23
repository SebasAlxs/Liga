import prisma from "../PrismaClient";
import { Headquarters } from "../../../../domain/entities/Headquarters";
import { HeadquartersRepository } from "../../../../domain/repositories/HeadquartersRepository";

export class PrismaHeadquartersRepository implements HeadquartersRepository {
    private prisma = prisma;

    async create(hq: Headquarters): Promise<Headquarters> {
        const created = await this.prisma.headquarters.create({
            data: {
                id: hq.id,
                name: hq.name,
                city: hq.city,
                address: hq.address,
                active: hq.active,
            },
        });

        return new Headquarters(created.id, created.name, created.city ?? undefined, created.address ?? undefined, created.active, created.createdAt, created.updatedAt);
    }

    async findById(id: string): Promise<Headquarters | null> {
        const hq = await this.prisma.headquarters.findUnique({ where: { id } });
        if (!hq) return null;
        return new Headquarters(hq.id, hq.name, hq.city ?? undefined, hq.address ?? undefined, hq.active, hq.createdAt, hq.updatedAt);
    }

    async findAll(): Promise<Headquarters[]> {
        const hqs = await this.prisma.headquarters.findMany({ orderBy: { createdAt: 'desc' } });
        return hqs.map((hq) => new Headquarters(hq.id, hq.name, hq.city ?? undefined, hq.address ?? undefined, hq.active, hq.createdAt, hq.updatedAt));
    }

    async update(hq: Headquarters): Promise<Headquarters> {
        const updated = await this.prisma.headquarters.update({
            where: { id: hq.id },
            data: {
                name: hq.name,
                city: hq.city,
                address: hq.address,
                active: hq.active,
            },
        });

        return new Headquarters(updated.id, updated.name, updated.city ?? undefined, updated.address ?? undefined, updated.active, updated.createdAt, updated.updatedAt);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.headquarters.delete({ where: { id } });
    }
}
