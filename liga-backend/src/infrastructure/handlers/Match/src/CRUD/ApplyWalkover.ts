import { Request, Response } from "express";
import { PrismaMatchRepository } from "../../../../db/prisma/repositories/PrismaMatchRepository";
import { PrismaFineRepository } from "../../../../db/prisma/repositories/PrismaFineRepository";
import { PrismaFineTypeRepository } from "../../../../db/prisma/repositories/PrismaFineTypeRepository";
import { PrismaMatchEventRepository } from "../../../../db/prisma/repositories/PrismaMatchEventRepository";
import { PrismaMatchLineupRepository } from "../../../../db/prisma/repositories/PrismaMatchLineupRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { RecalculateTeamStatsUseCase } from "../../../../../application/use-cases/Stats/RecalculateTeamStatsUseCase";
import { ApplyWalkoverUseCase } from "../../../../../application/use-cases/Match/ApplyWalkoverUseCase";
import { PrismaTournamentRepository } from "../../../../db/prisma/repositories/PrismaTournamentRepository";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { teamAbsentId } = req.body;

        if (!teamAbsentId) {
            return res.status(400).json({
                status: false,
                message: "Falta el teamAbsentId",
                data: null
            });
        }

        const matchRepository = new PrismaMatchRepository();
        const fineRepository = new PrismaFineRepository();
        const fineTypeRepository = new PrismaFineTypeRepository();
        
        // Dependencies for TeamStats
        const eventRepo = new PrismaMatchEventRepository();
        const lineupRepo = new PrismaMatchLineupRepository();
        const teamRepo = new PrismaTeamRepository();
        const tournamentRepo = new PrismaTournamentRepository();

        const teamStatsUseCase = new RecalculateTeamStatsUseCase(
            teamRepo,
            matchRepository
        );

        const useCase = new ApplyWalkoverUseCase(
            matchRepository,
            fineRepository,
            fineTypeRepository,
            teamStatsUseCase
        );

        await useCase.execute(id as string, teamAbsentId as string);

        return res.status(200).json({
            status: true,
            message: "W.O. aplicado exitosamente. El partido ha finalizado.",
            data: null
        });

    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message || "Error al aplicar W.O.",
            data: null
        });
    }
};
