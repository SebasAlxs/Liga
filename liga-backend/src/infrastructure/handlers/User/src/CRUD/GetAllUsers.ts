import { Request, Response } from "express";
import { GetAllUsersUseCase } from "../../../../../application/use-cases/User/GetAllUsersUseCase";
import { PrismaUserRepository } from "../../../../db/prisma/repositories/PrismaUserRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (_req: Request, res: Response) => {
    try {
        const repo = new PrismaUserRepository();
        const useCase = new GetAllUsersUseCase(repo);
        const users = await useCase.execute();
        return successResponse(res, users, 200, "Consulta exitosa.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
