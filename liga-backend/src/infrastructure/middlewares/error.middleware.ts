import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../libs/api-gateway";
import { logger } from "../libs/logger";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`[Global Error] ${req.method} ${req.url}: ${err.message}`, { stack: err.stack });
    
    if (res.headersSent) {
        return next(err);
    }
    
    return errorResponse(res, "Ocurrió un error interno en el servidor.", 500);
};
