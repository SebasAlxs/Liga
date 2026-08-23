import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { DomainError } from "../../../domain/exceptions/DomainError";
import bcrypt from "bcryptjs";
import { UserResponse, UpdateUserRequest } from "../../../adapters/http/dto/UserResponse";
import { UserRepository } from "../../../domain/repositories/UserRepository";

const VALID_ROLES = ["SUPERADMIN", "ADMIN", "VOCAL", "DIRIGENTE"];

export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(id: string, request: UpdateUserRequest): Promise<UserResponse> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundError("Usuario no encontrado.");
        }

        if (request.role && !VALID_ROLES.includes(request.role)) {
            throw new DomainError(`Rol inválido. Debe ser uno de: ${VALID_ROLES.join(", ")}.`);
        }

        if (request.role && request.role !== "SUPERADMIN" && existingUser.role === "SUPERADMIN") {
            const allUsers = await this.userRepository.findAll();
            const superAdminCount = allUsers.filter((u) => u.role === "SUPERADMIN").length;
            if (superAdminCount <= 1) {
                throw new DomainError("No se puede quitar el rol SUPERADMIN al único administrador principal.");
            }
        }

        if (request.email && request.email !== existingUser.email) {
            const emailOwner = await this.userRepository.findByEmail(request.email);
            if (emailOwner) {
                throw new DomainError("El correo electrónico ya está en uso.");
            }
            existingUser.email = request.email;
        }

        if (request.role) existingUser.role = request.role as any;
        if (request.password) existingUser.password = await bcrypt.hash(request.password, 10);

        const updated = await this.userRepository.update(existingUser);

        return {
            _id: updated.id!,
            email: updated.email,
            role: updated.role!,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
        };
    }
}
