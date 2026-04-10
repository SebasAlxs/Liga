import { Request, Response } from "express";
import { RegisterUseCase } from "../../../../application/use-cases/Auth/RegisterUseCase";
import { PrismaUserRepository } from "../../../db/prisma/repositories/PrismaUserRepository";
import { successResponse, errorResponse } from "../../../libs/api-gateway";

export const handler = async (req: Request, res: Response) => {
  try {
    const repo = new PrismaUserRepository();
    const useCase = new RegisterUseCase(repo);
    const user = await useCase.execute(req.body);
    return successResponse(res, user, 201, "Usuario registrado exitosamente.");
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};
