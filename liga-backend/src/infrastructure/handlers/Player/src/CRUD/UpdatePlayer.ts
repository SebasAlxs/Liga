import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from "../../../../services/StorageService";

import { UpdatePlayerUseCase } from "../../../../../application/use-cases/Player/UpdatePlayerUseCase";
import { PrismaPlayerRepository } from "../../../../db/prisma/repositories/PrismaPlayerRepository";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { PrismaCategoryRepository } from "../../../../db/prisma/repositories/PrismaCategoryRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

const PLAYER_UNIQUE_MESSAGES = {
    "dni": "Ya existe un jugador registrado con esa cédula.",
    "teamId,number": "Ese dorsal ya está asignado a otro jugador de este equipo.",
};

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaPlayerRepository();
        const teamRepo = new PrismaTeamRepository();
        const categoryRepo = new PrismaCategoryRepository();
        const useCase = new UpdatePlayerUseCase(repo, teamRepo, categoryRepo);
        
        if (req.body.picture && !req.body.picture.startsWith('http')) {
            const storageService = new StorageService();
            const filename = `player-${req.body.dni || uuidv4()}.jpg`;
            req.body.picture = await storageService.uploadImage(req.body.picture, filename, 'players');
        }
        
        const player = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, player, 200, "Jugador actualizado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error, PLAYER_UNIQUE_MESSAGES);
    }
};
