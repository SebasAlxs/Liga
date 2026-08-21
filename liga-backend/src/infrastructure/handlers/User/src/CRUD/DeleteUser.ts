import { Request, Response } from "express";
import { DeleteUserUseCase } from "../../../../../application/use-cases/User/DeleteUserUseCase";
import { PrismaUserRepository } from "../../../../db/prisma/repositories/PrismaUserRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repo = new PrismaUserRepository();
        const useCase = new DeleteUserUseCase(repo);
        await useCase.execute(id as string, req.user?.id);
        return successResponse(res, null, 200, "Usuario eliminado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error);
    }
};
