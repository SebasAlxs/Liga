import { Request, Response } from "express";
import { GetAllTeamsUseCase } from "../../../../../application/use-cases/Team/GetAllTeamsUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse, parsePagination, buildPagination , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new GetAllTeamsUseCase(repo);
        const { skip, take, page, limit } = parsePagination(req.query);
        const managedByMe = req.query.managedByMe === 'true';
        let managerIdFilter = undefined;
        if (managedByMe && (req as any).user && (req as any).user.role === 'DIRIGENTE') {
            managerIdFilter = (req as any).user.id;
        }
        const { items, total } = await useCase.execute({ skip, take }, managerIdFilter);
        return successResponse(res, items, 200, "Equipos obtenidos con éxito.", buildPagination(total, page, limit));
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
