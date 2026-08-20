import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from "../../../../services/StorageService";

import { CreatePlayerUseCase } from "../../../../../application/use-cases/Player/CreatePlayerUseCase";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaPlayerRepository();
        const teamRepo = new PrismaTeamRepository();
        const categoryRepo = new PrismaCategoryRepository();
        const useCase = new CreatePlayerUseCase(repo, teamRepo, categoryRepo);
        
        if (req.body.picture && !req.body.picture.startsWith('http')) {
            const storageService = new StorageService();
            const filename = `player-${req.body.dni || uuidv4()}.jpg`;
            req.body.picture = await storageService.uploadImage(req.body.picture, filename, 'players');
        }
        
        const player = await useCase.execute(req.body);
        return successResponse(res, player, 201, "Jugador creado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
