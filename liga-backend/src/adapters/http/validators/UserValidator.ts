import { z } from "zod";

const VALID_ROLES = ["SUPERADMIN", "ADMIN", "VOCAL", "DIRIGENTE"] as const;

export const UserValidator = {
    create: z.object({
        body: z.object({
            email: z.string().min(1, "El correo electrónico es requerido.").email("El formato del correo electrónico no es válido."),
            password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
            role: z.enum(VALID_ROLES),
        }),
    }),
    update: z.object({
        body: z.object({
            email: z.string().email("El formato del correo electrónico no es válido.").optional(),
            password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional(),
            role: z.enum(VALID_ROLES).optional(),
        }),
        params: z.object({
            id: z.string().uuid("El ID de usuario no es un UUID válido."),
        }),
    }),
};
