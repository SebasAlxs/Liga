import prisma from "../PrismaClient";
import { ModuleAccess } from "../../../../domain/entities/ModuleAccess";
import { ModuleAccessRepository, ModuleAccessUpsertInput } from "../../../../domain/repositories/ModuleAccessRepository";

// Catálogo de módulos y roles conocidos, usado únicamente para sembrar
// la matriz por defecto (todo visible) la primera vez que se consulta.
const MODULE_KEYS = [
    "dashboard",
    "matches",
    "teams",
    "players",
    "standings",
    "vocalia",
    "settings",
    "scoring",
    "tournaments",
    "venues",
    "fines",
    "sanctions",
    "fixture",
];
const ROLES = ["SUPERADMIN", "ADMIN", "VOCAL", "DIRIGENTE"];

export class PrismaModuleAccessRepository implements ModuleAccessRepository {
    private prisma = prisma;

    private async ensureSeeded() {
        const data = ROLES.flatMap((role) =>
            MODULE_KEYS.map((module) => ({ role: role as any, module, visible: true }))
        );
        await this.prisma.moduleAccess.createMany({ data, skipDuplicates: true });
    }

    async findAll(): Promise<ModuleAccess[]> {
        await this.ensureSeeded();
        const rows = await this.prisma.moduleAccess.findMany({
            orderBy: [{ module: "asc" }, { role: "asc" }],
        });
        return rows.map(
            (r) => new ModuleAccess(r.id, r.role, r.module, r.visible, r.createdAt, r.updatedAt)
        );
    }

    async findByRole(role: string): Promise<ModuleAccess[]> {
        await this.ensureSeeded();
        const rows = await this.prisma.moduleAccess.findMany({ where: { role: role as any } });
        return rows.map(
            (r) => new ModuleAccess(r.id, r.role, r.module, r.visible, r.createdAt, r.updatedAt)
        );
    }

    async upsertMany(items: ModuleAccessUpsertInput[]): Promise<ModuleAccess[]> {
        const results = await this.prisma.$transaction(
            items.map((item) =>
                this.prisma.moduleAccess.upsert({
                    where: { role_module: { role: item.role as any, module: item.module } },
                    update: { visible: item.visible },
                    create: { role: item.role as any, module: item.module, visible: item.visible },
                })
            )
        );
        return results.map(
            (r) => new ModuleAccess(r.id, r.role, r.module, r.visible, r.createdAt, r.updatedAt)
        );
    }
}
