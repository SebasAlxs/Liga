import { z } from "zod";

export const AuthValidator = {
    login: z.object({
        body: z.object({
            email: z.string().min(1, "El correo electrónico es requerido.").email("El formato del correo electrónico no es válido."),
            password: z.string().min(1, "La contraseña no puede estar vacía."),
        }),
    }),
};
