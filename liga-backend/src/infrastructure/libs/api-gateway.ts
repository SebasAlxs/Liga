import { Response } from "express";
import { Prisma } from "@prisma/client";
import { Pagination } from "../../adapters/http/dto/BaseResponse";

export const successResponse = (
    res: Response,
    data: any,
    statusCode: number = 200,
    message: string = "Consulta exitosa.",
    pagination: Pagination = { currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 },
    fieldValidations: Record<string, any> = {}
) => {
    return res.status(statusCode).json({
        status: true,
        message,
        data,
        pagination: Array.isArray(data) ? { ...pagination, totalCount: data.length } : pagination,
        fieldValidations
    });
};

export const errorResponse = (
    res: Response,
    message: string = "Ocurrió un error.",
    statusCode: number = 500,
    fieldValidations: Record<string, any> = {}
) => {
    return res.status(statusCode).json({
        status: false,
        message,
        data: null,
        pagination: { currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 },
        fieldValidations
    });
};

/**
 * Translates known Prisma errors (unique constraint, missing record, bad FK)
 * into a friendly message and the correct HTTP status, instead of a generic 500.
 * `friendlyMessages` maps a comma-joined field target (e.g. "teamId,number") to a custom message.
 */
export const handleErrorResponse = (
    res: Response,
    error: any,
    friendlyMessages: Record<string, string> = {}
) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            const target = Array.isArray(error.meta?.target) ? (error.meta.target as string[]).join(",") : String(error.meta?.target ?? "");
            const message = friendlyMessages[target] || `Ya existe un registro con el mismo valor en: ${target}.`;
            return errorResponse(res, message, 409);
        }
        if (error.code === "P2025") {
            return errorResponse(res, "El registro no existe o ya fue eliminado.", 404);
        }
        if (error.code === "P2003") {
            return errorResponse(res, "La referencia indicada (equipo, categoría, etc.) no existe.", 400);
        }
    }
    return errorResponse(res, error.message || "Ocurrió un error.", 500);
};
