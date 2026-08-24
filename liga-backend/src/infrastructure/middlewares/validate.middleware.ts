import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { errorResponse } from "../libs/api-gateway";

export const validateRequest = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldValidations: Record<string, string[]> = {};
                const validationErrors = (error as any).errors || (error as any).issues || [];
                
                validationErrors.forEach((err: any) => {
                    const path = err.path && err.path.length > 1 ? err.path[1].toString() : (err.path && err.path[0]?.toString()) || 'unknown';
                    if (!fieldValidations[path]) {
                        fieldValidations[path] = [];
                    }
                    fieldValidations[path].push(err.message);
                });
                
                return errorResponse(res, "Error de validación en los datos enviados.", 400, fieldValidations);
            }
            return next(error);
        }
    };
};
