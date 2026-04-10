import { Response } from "express";
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
