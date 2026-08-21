import { Request, Response } from "express";
import { GetAllMatchesUseCase } from "../../../../../application/use-cases/Match/GetAllMatchesUseCase";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { successResponse, errorResponse, parsePagination, buildPagination } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaMatchRepository();
        const useCase = new GetAllMatchesUseCase(repo);
        const { skip, take, page, limit } = parsePagination(req.query);
        const { items, total } = await useCase.execute({ skip, take });
        return successResponse(res, items, 200, "Partidos obtenidos con éxito.", buildPagination(total, page, limit));
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
