import { Request, Response } from "express";
import { GetStandingsUseCase } from "../../../../../application/use-cases/Stats/GetStandingsUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new GetStandingsUseCase(repo);

        const tournamentId = req.params.tournamentId as string;
        if (!tournamentId) {
            throw new Error("El ID del torneo es requerido");
        }

        const standings = await useCase.execute(tournamentId);
        return successResponse(res, standings, 200, "Tabla de posiciones obtenida exitosamente.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
