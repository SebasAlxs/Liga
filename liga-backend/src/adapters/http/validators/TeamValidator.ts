import { z } from "zod";

const optionalUrl = (message?: string) =>
    z.preprocess((val) => (val === "" ? undefined : val), z.string().url(message).optional());

export const TeamValidator = {
    create: z.object({
        body: z.object({
            name: z.string()
                   .min(3, "El nombre del equipo debe tener al menos 3 caracteres.")
                   .max(100, "El nombre no puede exceder 100 caracteres."),
            logo: optionalUrl("El logo debe ser una URL válida."),
            foundedYear: z.number().int("El año debe ser un número entero.")
                          .max(new Date().getFullYear(), "El año de fundación no puede estar en el futuro.")
                          .optional(),
            championshipsWon: z.number().int().min(0).optional(),
            categoryId: z.string().uuid("El categoryId debe ser un UUID válido.").optional(),
            tournamentId: z.string().uuid("El tournamentId debe ser un UUID válido.").optional(),
        }),
    }),
    update: z.object({
        body: z.object({
            name: z.string().min(3).max(100).optional(),
            logo: optionalUrl(),
            foundedYear: z.number().int().max(new Date().getFullYear()).optional(),
            championshipsWon: z.number().int().min(0).optional(),
            categoryId: z.string().uuid().optional(),
            tournamentId: z.string().uuid().optional(),
        }),
        params: z.object({
            id: z.string().uuid("El ID de equipo no es válido."),
        }),
    }),
};
