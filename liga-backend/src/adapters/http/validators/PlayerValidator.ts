import { z } from "zod";

export const PlayerValidator = {
    create: z.object({
        body: z.object({
            firstName: z.string()
                        .min(2, "El nombre debe tener al menos 2 caracteres."),
            lastName: z.string()
                       .min(2, "El apellido debe tener al menos 2 caracteres."),
            dni: z.string()
                  .min(5, "La cédula debe tener al menos 5 caracteres."),
            birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Formato de fecha inválido." }).optional(),
            photo: z.string().url("La foto debe ser una URL válida.").optional(),
            position: z.string().optional(),
            number: z.number().int().min(0).max(99).optional(),
            teamId: z.string().uuid("El teamId debe ser un UUID válido.").optional(),
            categoryId: z.string().uuid("El categoryId debe ser un UUID válido.").optional(),
        }),
    }),
    update: z.object({
        body: z.object({
            firstName: z.string().min(2).optional(),
            lastName: z.string().min(2).optional(),
            dni: z.string().min(5).optional(),
            birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Formato de fecha inválido." }).optional(),
            photo: z.string().url().optional(),
            position: z.string().optional(),
            number: z.number().int().min(0).max(99).optional(),
            teamId: z.string().uuid().optional(),
            categoryId: z.string().uuid().optional(),
        }),
        params: z.object({
            id: z.string().uuid("El ID del jugador no es válido."),
        }),
    }),
};
