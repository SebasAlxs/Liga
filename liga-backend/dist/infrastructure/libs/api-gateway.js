"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, data, statusCode = 200, message = "Consulta exitosa.", pagination = { currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 }, fieldValidations = {}) => {
    return res.status(statusCode).json({
        status: true,
        message,
        data,
        pagination: Array.isArray(data) ? { ...pagination, totalCount: data.length } : pagination,
        fieldValidations
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, message = "Ocurrió un error.", statusCode = 500, fieldValidations = {}) => {
    return res.status(statusCode).json({
        status: false,
        message,
        data: null,
        pagination: { currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 },
        fieldValidations
    });
};
exports.errorResponse = errorResponse;
