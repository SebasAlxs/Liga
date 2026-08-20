import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../../../application/use-cases/User/CreateUserUseCase";
import { PrismaUserRepository } from "../../../../db/prisma/repositories/PrismaUserRepository";
import { successResponse, handleErrorResponse } from "../../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
    try {
        const repo = new PrismaUserRepository();
        const useCase = new CreateUserUseCase(repo);
        const user = await useCase.execute(req.body);
        return successResponse(res, user, 201, "Usuario creado con éxito.");
    } catch (error: any) {
        return handleErrorResponse(res, error, { email: "Ese correo electrónico ya está registrado." });
    }
};
