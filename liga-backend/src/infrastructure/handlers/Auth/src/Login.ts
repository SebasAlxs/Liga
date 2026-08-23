import { Request, Response } from "express";
import { LoginUseCase } from "../../../../application/use-cases/Auth/LoginUseCase";
import { PrismaUserRepository } from "../../../db/prisma/repositories/PrismaUserRepository";
import { successResponse, errorResponse , handleErrorResponse } from "../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
  try {
    const repo = new PrismaUserRepository();
    const useCase = new LoginUseCase(repo);
    const result = await useCase.execute(req.body);
    return successResponse(res, result, 200, "Inicio de sesión exitoso.");
  } catch (error: any) {
    return handleErrorResponse(res, error);
  }
};
