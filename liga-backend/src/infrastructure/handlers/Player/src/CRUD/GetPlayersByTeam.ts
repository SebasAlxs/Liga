import { Request, Response } from "express";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { GetPlayersByTeamUseCase } from "../../../../../application/use-cases/Player/GetPlayersByTeamUseCase";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const teamId = req.params.teamId as string;
        const includePicture = req.query.includePicture === 'true';
        const repo = new PrismaPlayerRepository();
        const useCase = new GetPlayersByTeamUseCase(repo);
        const players = await useCase.execute(teamId, includePicture);
        return successResponse(res, players);
    } catch (error: any) {
        console.error("Error in GetPlayersByTeam:", error);
        return errorResponse(res, error.message);
    }
};
