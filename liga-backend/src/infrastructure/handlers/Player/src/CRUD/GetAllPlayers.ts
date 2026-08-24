import { Request, Response } from "express";
import { GetAllPlayersUseCase } from "../../../../../application/use-cases/Player/GetAllPlayersUseCase";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { successResponse, errorResponse, parsePagination, buildPagination , handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaPlayerRepository();
        const useCase = new GetAllPlayersUseCase(repo);
        const includePicture = req.query.includePicture === 'true';
        const { skip, take, page, limit } = parsePagination(req.query);
        const managedByMe = req.query.managedByMe === 'true';
        let managerIdFilter = undefined;
        if (managedByMe && (req as any).user && (req as any).user.role === 'DIRIGENTE') {
            managerIdFilter = (req as any).user.id;
        }
        const { items, total } = await useCase.execute(includePicture, { skip, take }, managerIdFilter);
        return successResponse(res, items, 200, "Consulta exitosa.", buildPagination(total, page, limit));
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
