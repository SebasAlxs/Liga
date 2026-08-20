import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from "../../../../services/StorageService";

import { UpdateTeamUseCase } from "../../../../../application/use-cases/Team/UpdateTeamUseCase";
import { PrismaTeamRepository } from "../../../../db/prisma/repositories/PrismaTeamRepository";
import { successResponse, errorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaTeamRepository();
        const useCase = new UpdateTeamUseCase(repo);
        
        if (req.body.logo && !req.body.logo.startsWith('http')) {
            const storageService = new StorageService();
            const filename = `team-${req.body.name || uuidv4()}.jpg`;
            req.body.logo = await storageService.uploadImage(req.body.logo, filename, 'logos');
        }
        
        const team = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, team, 200, "Equipo actualizado con éxito.");
    } catch (error: any) {
        return errorResponse(res, error.message);
    }
};
