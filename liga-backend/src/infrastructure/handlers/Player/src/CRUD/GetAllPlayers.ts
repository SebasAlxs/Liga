import { Request, Response } from "express";
import { GetAllPlayersUseCase } from "../../../../../application/use-cases/Player/GetAllPlayersUseCase";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaPlayerRepository();
        const useCase = new GetAllPlayersUseCase(repo);
        const includePicture = req.query.includePicture === 'true';
        const players = await useCase.execute(includePicture);
        return successResponse(res, players);
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
