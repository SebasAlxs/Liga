import { Response } from "express";
import { Prisma } from "@prisma/client";
import { Pagination } from "../../adapters/http/dto/BaseResponse";

export const successResponse = (
    res: Response,
    data: any,
    statusCode: number = 200,
    message: string = "Consulta exitosa.",
    pagination?: Pagination,
    fieldValidations: Record<string, any> = {}
) => {
    // Si no se pasó paginación explícita, se infiere del array (comportamiento legado para
    // endpoints sin paginación real). Cuando el caller SÍ pasa `pagination` (con totalCount
    // real de la base de datos), se respeta tal cual y no se sobreescribe con data.length.
    const resolvedPagination = pagination
        ?? (Array.isArray(data)
            ? { currentPage: 1, totalPages: 1, totalCount: data.length, limit: data.length }
            : { currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 });

    return res.status(statusCode).json({
        status: true,
        message,
        data,
        pagination: resolvedPagination,
        fieldValidations
    });
};

/**
 * Lee `page`/`limit` de req.query y calcula skip/take reales para Prisma.
 * Sin `limit` en la query, no pagina (comportamiento legado): trae todo.
 */
export const parsePagination = (query: Record<string, any>) => {
    const limit = query.limit ? parseInt(query.limit, 10) : undefined;
    const page = query.page ? Math.max(1, parseInt(query.page, 10)) : 1;

    if (!limit || Number.isNaN(limit) || limit <= 0) {
        return { page, limit: undefined, skip: undefined, take: undefined };
    }
    return { page, limit, skip: (page - 1) * limit, take: limit };
};

export const buildPagination = (total: number, page: number, limit?: number): Pagination => {
    if (!limit) {
        return { currentPage: 1, totalPages: 1, totalCount: total, limit: total };
    }
    return { currentPage: page, totalPages: Math.max(1, Math.ceil(total / limit)), totalCount: total, limit };
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
