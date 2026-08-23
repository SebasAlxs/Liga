import { DomainError } from "../../../domain/exceptions/DomainError";
import bcrypt from "bcryptjs";
import { UserResponse, CreateUserRequest } from "../../../adapters/http/dto/UserResponse";
import { UserRepository } from "../../../domain/repositories/UserRepository";

const VALID_ROLES = ["SUPERADMIN", "ADMIN", "VOCAL", "DIRIGENTE"];

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(request: CreateUserRequest): Promise<UserResponse> {
        if (!request.email || !request.password || !request.role) {
            throw new DomainError("Email, contraseña y rol son obligatorios.");
        }

        if (!VALID_ROLES.includes(request.role)) {
            throw new DomainError(`Rol inválido. Debe ser uno de: ${VALID_ROLES.join(", ")}.`);
        }

        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new DomainError("El correo electrónico ya está en uso.");
        }

        const hashedPassword = await bcrypt.hash(request.password, 10);
        const created = await this.userRepository.create({
            email: request.email,
            password: hashedPassword,
            role: request.role as any,
        });

        return {
            _id: created.id!,
            email: created.email,
            role: created.role!,
            createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
