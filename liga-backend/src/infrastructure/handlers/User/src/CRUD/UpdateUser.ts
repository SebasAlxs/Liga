import { Request, Response } from "express";
import { UpdateUserUseCase } from "../../../../../application/use-cases/User/UpdateUserUseCase";
import { PrismaUserRepository } from "../../../../db/prisma/repositories/PrismaUserRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaUserRepository();
        const useCase = new UpdateUserUseCase(repo);
        const user = await useCase.execute(req.params.id as string, req.body);
        return successResponse(res, user, 200, "Usuario actualizado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error, { email: "Ese correo electrónico ya está registrado." });
    }
};
